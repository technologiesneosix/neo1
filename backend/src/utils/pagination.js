export const getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

export const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

export const paginate = (query, Model) => {
  const { page, limit, skip } = getPaginationParams(query);

  return Promise.all([
    Model.countDocuments(query),
    Model.find(query).skip(skip).limit(limit),
  ]).then(([total, data]) => ({
    data,
    meta: getPaginationMeta(total, page, limit),
  }));
};
