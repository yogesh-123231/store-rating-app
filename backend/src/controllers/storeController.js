const prisma = require('../config/db');
const {
  getPagination,
  buildPaginationResponse,
} = require('../utils/pagination');

function buildStoreSearchFilter(search) {
  if (!search || !search.trim()) {
    return {};
  }

  const term = search.trim();

  return {
    OR: [
      { name: { contains: term, mode: 'insensitive' } },
      { address: { contains: term, mode: 'insensitive' } },
    ],
  };
}

function roundRating(avg) {
  if (avg === null || avg === undefined) {
    return null;
  }

  return Math.round(avg * 10) / 10;
}

async function getStores(req, res) {
  const query = req.validatedQuery;
  const { page, limit, skip } = getPagination(query);
  const where = buildStoreSearchFilter(query.search);

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      select: {
        id: true,
        name: true,
        address: true,
      },
      orderBy: { name: 'asc' },
      skip,
      take: limit,
    }),
    prisma.store.count({ where }),
  ]);

  if (stores.length === 0) {
    return res.status(200).json({
      data: [],
      pagination: buildPaginationResponse(page, limit, total),
    });
  }

  const storeIds = stores.map((store) => store.id);

  const [averageRatings, userRatings] = await Promise.all([
    prisma.rating.groupBy({
      by: ['storeId'],
      where: { storeId: { in: storeIds } },
      _avg: { rating: true },
    }),
    prisma.rating.findMany({
      where: {
        userId: req.user.id,
        storeId: { in: storeIds },
      },
      select: {
        storeId: true,
        rating: true,
      },
    }),
  ]);

  const averageRatingMap = new Map(
    averageRatings.map((item) => [item.storeId, roundRating(item._avg.rating)])
  );
  const userRatingMap = new Map(
    userRatings.map((item) => [item.storeId, item.rating])
  );

  const data = stores.map((store) => {
    const userRating = userRatingMap.get(store.id) ?? null;

    return {
      id: store.id,
      name: store.name,
      address: store.address,
      overallRating: averageRatingMap.get(store.id) ?? null,
      userRating,
      canModify: req.user.role === 'USER' && userRating !== null,
    };
  });

  return res.status(200).json({
    data,
    pagination: buildPaginationResponse(page, limit, total),
  });
}

async function submitRating(req, res) {
  if (req.user.role !== 'USER') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Only normal users can submit ratings',
      },
    });
  }

  const { storeId, rating } = req.body;

  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Store not found',
      },
    });
  }

  if (store.ownerId === req.user.id) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You cannot rate your own store',
      },
    });
  }

  const existingRating = await prisma.rating.findUnique({
    where: {
      userId_storeId: {
        userId: req.user.id,
        storeId,
      },
    },
  });

  const savedRating = await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: req.user.id,
        storeId,
      },
    },
    update: { rating },
    create: {
      userId: req.user.id,
      storeId,
      rating,
    },
  });

  return res.status(existingRating ? 200 : 201).json(savedRating);
}

module.exports = {
  getStores,
  submitRating,
};
