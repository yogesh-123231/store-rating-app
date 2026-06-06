function getPagination(query) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

function getSortOrder(query, allowedFields, defaultField = 'name') {
  const sortBy = allowedFields.includes(query.sortBy)
    ? query.sortBy
    : defaultField;
  const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';

  return { [sortBy]: sortOrder };
}

function buildPaginationResponse(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

module.exports = {
  getPagination,
  getSortOrder,
  buildPaginationResponse,
};
