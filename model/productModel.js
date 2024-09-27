import prismaClient from "../utils/prismaClient.js";

function whereConditions(keyword) {
  return keyword
    ? (whereConditions.OR = [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ])
    : {};
}

export const getTotalCount = async (keyword) => {
  const where = whereConditions(keyword);
  return await prismaClient.product.count({
    where,
  });
};

export const getList = async (pageSize, offset, orderOption, keyword) => {
  const where = whereConditions(keyword);
  return await prismaClient.product.findMany({
    take: pageSize,
    skip: pageSize * offset,
    orderBy: orderOption,
    where,
    include: {
      user: {
        select: {
          name: true,
          id: true,
        },
      },
      comment: {
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
};
