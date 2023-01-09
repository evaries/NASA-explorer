const getPagination = (query) => {
  console.log(query);
  const limit = Math.abs(query.limit) || 0;
  const page = Math.abs(query.page) || 1;
  const skip = (page - 1) * limit;
  return {
    limit,
    skip,
  };
};

module.exports = { getPagination };