const prisma = require('../config/db');
const { hashPassword } = require('../utils/hashPassword');
const {
  getPagination,
  getSortOrder,
  buildPaginationResponse,
} = require('../utils/pagination');

const ALLOWED_USER_SORT_FIELDS = ['name', 'email', 'createdAt'];
const ALLOWED_STORE_SORT_FIELDS = ['name', 'email', 'createdAt'];

async function getStoreAverageRating(storeId) {
  const result = await prisma.rating.aggregate({
    where: { storeId },
    _avg: { rating: true },
  });

  if (result._avg.rating === null) {
    return null;
  }

  return Math.round(result._avg.rating * 10) / 10;
}

function buildSearchFilter(search) {
  if (!search || !search.trim()) {
    return {};
  }

  const term = search.trim();

  return {
    OR: [
      { name: { contains: term, mode: 'insensitive' } },
      { email: { contains: term, mode: 'insensitive' } },
      { address: { contains: term, mode: 'insensitive' } },
    ],
  };
}

function omitPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function createUser(req, res) {
  try {
    const { name, email, password, address, role } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'Email already exists',
        },
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        address,
        role,
      },
    });

    return res.status(201).json(omitPassword(user));
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'Email already exists',
        },
      });
    }

    throw error;
  }
}

async function createStore(req, res) {
  const { name, email, address, ownerId } = req.body;

  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
  });

  if (!owner || owner.role !== 'OWNER') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Owner not found or user is not a store owner',
      },
    });
  }

  const store = await prisma.store.create({
    data: {
      name,
      email: email.toLowerCase(),
      address,
      ownerId,
    },
  });

  return res.status(201).json(store);
}

async function getDashboard(req, res) {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  return res.status(200).json({
    totalUsers,
    totalStores,
    totalRatings,
  });
}

async function getAllUsers(req, res) {
  const query = req.validatedQuery;
  const { page, limit, skip } = getPagination(query);
  const orderBy = getSortOrder(query, ALLOWED_USER_SORT_FIELDS);

  const where = {
    ...buildSearchFilter(query.search),
  };

  if (query.role) {
    where.role = query.role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return res.status(200).json({
    data: users,
    pagination: buildPaginationResponse(page, limit, total),
  });
}

async function getUserById(req, res) {
  const userId = req.validatedParams.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      ownedStores: {
        orderBy: { id: 'asc' },
        take: 1,
        select: { id: true },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'User not found',
      },
    });
  }

  const response = {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  if (user.role === 'OWNER' && user.ownedStores.length > 0) {
    response.rating = await getStoreAverageRating(user.ownedStores[0].id);
  }

  return res.status(200).json(response);
}

async function getAllStores(req, res) {
  const query = req.validatedQuery;
  const { page, limit, skip } = getPagination(query);
  const orderBy = getSortOrder(query, ALLOWED_STORE_SORT_FIELDS);

  const where = buildSearchFilter(query.search);

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.store.count({ where }),
  ]);

  const data = await Promise.all(
    stores.map(async (store) => ({
      ...store,
      averageRating: await getStoreAverageRating(store.id),
    }))
  );

  return res.status(200).json({
    data,
    pagination: buildPaginationResponse(page, limit, total),
  });
}

module.exports = {
  createUser,
  createStore,
  getDashboard,
  getAllUsers,
  getUserById,
  getAllStores,
};
