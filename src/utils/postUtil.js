import { DEFAULT_POST_PAGE_SIZE } from "../constants/post.js";

export function getPostQueryFilter(query) {
  const { page, pageSize, order, keyword = "" } = query;

  let orderBy;
  switch (order) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "recent":
    default:
      orderBy = { createdAt: "desc" };
  }

  const pageNum = Number(page) || 1;
  const pageSizeNum = Number(pageSize) || DEFAULT_Post_PAGE_SIZE;
  const skipInt = (pageNum - 1) * pageSizeNum;

  return {
    orderBy,
    skip: skipInt,
    take: pageSizeNum,
    where: {
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ],
    },
  };
}

export function getPostSearchFilter(keyword) {
  return {
    OR: [
      { name: { contains: keyword } },
      { description: { contains: keyword } },
    ],
  };
}
