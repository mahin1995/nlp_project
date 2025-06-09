const pageAbleQuery = (queryParams: any) => {
  queryParams.limit = parseInt(queryParams.limit, 10) || 10;
  const page = parseInt(queryParams.page, 10) || 0;
  if (page === 1) {
    queryParams.offset = 0;
    queryParams.page = 0;
  } else {
    queryParams.offset = queryParams.limit * page;
    queryParams.page = page;
  }

  queryParams.sort = queryParams.sort === "des" ? -1 : 1 || "asc" ? 1 : -1;
  return queryParams;
};
export default pageAbleQuery;
