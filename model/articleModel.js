import prismaClient from "../utils/prismaClient.js";

const getArticles = async ({
  cursor,
  limit,
  whereConditions,
  orderbyQuery,
}) => {
  return prisma.article.findMany({
    where: whereConditions,
    take: limit + 1, //추가적인 게시글이 있는지 확인
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: orderbyQuery,
    include: {
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
};

const getArticle = async (id) => {
  return prismaClient.article.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      user: true,
      comment: {
        orderBy: { createAt: "desc" },
        include: { user: true },
      },
    },
  });
};

const updateArticle = async (id) => {
  return prismaClient.article.update({
    where: {
      id,
    },
    include: {
      user: true,
      comment: {
        orderBy: { createAt: "desc" },
        include: { user: true },
      },
    },
  });
};

const createArticle = async (data) => {
  return prismaClient.article.create({
    data,
    include: {
      user: true,
    },
  });
};

const deleteArticle = async (id) => {
  return prismaClient.article.delete({
    where: {
      id,
    },
  });
};

export default {
  getArticles,
  getArticle,
  updateArticle,
  createArticle,
  deleteArticle,
};
