const prisma = require('../config/db');
const {
  getPagination,
  buildPaginationResponse,
} = require('../utils/pagination');

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

async function getOwnerStore(ownerId) {
  return prisma.store.findFirst({
    where: { ownerId },
    orderBy: { id: 'asc' },
  });
}

async function getOwnStore(req, res) {
  const store = await getOwnerStore(req.user.id);

  if (!store) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Store not found',
      },
    });
  }

  const averageRating = await getStoreAverageRating(store.id);

  return res.status(200).json({
    ...store,
    averageRating,
  });
}

async function getStoreRaters(req, res) {
  const store = await getOwnerStore(req.user.id);

  if (!store) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Store not found',
      },
    });
  }

  const { page, limit, skip } = getPagination(req.validatedQuery);

  const where = { storeId: store.id };

  const [ratings, total] = await Promise.all([
    prisma.rating.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.rating.count({ where }),
  ]);

  const data = ratings.map((rating) => ({
    userId: rating.user.id,
    userName: rating.user.name,
    rating: rating.rating,
    createdAt: rating.createdAt,
  }));

  return res.status(200).json({
    data,
    pagination: buildPaginationResponse(page, limit, total),
  });
}

module.exports = {
  getOwnStore,
  getStoreRaters,
};
