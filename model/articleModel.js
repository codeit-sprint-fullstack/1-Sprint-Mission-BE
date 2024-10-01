import prismaClient from "../utils/prismaClient.js";

const getArticles = async ({
  cursor,
  limit,
  whereConditions,
  orderbyQuery,
}) => {
  return prismaClient.article.findMany({
    where: whereConditions,
    take: limit + 1, //추가적인 게시글이 있는지 확인
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: orderbyQuery,
    include: {
      owner: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const findById = async (id) => {
  return prismaClient.article.findUnique({
    where: {
      id,
    },
    include: {
      owner: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const updateArticle = async (articleId, data) => {
  return prismaClient.article.update({
    where: {
      id: articleId,
    },
    data,
    include: {
      owner: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const existingLike = async (articleId, userId) => {
  return prismaClient.article.findUnique({
    where: {
      id: articleId,
      favorited: {
        some: {
          id: userId,
        },
      },
    },
  });
};

const likeArticle = async ({ articleId, userId }) => {
  return prismaClient.article.update({
    where: {
      id: articleId,
    },
    data: {
      favorited: {
        connect: { id: userId },
      },
      favoriteCount: { increment: 1 },
    },
    include: {
      owner: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const unlikeArticle = async ({ articleId, userId }) => {
  return prismaClient.article.update({
    where: {
      id: articleId,
    },
    data: {
      favorited: {
        connect: { id: userId },
      },
      favoriteCount: { decrement: 1 },
    },
    include: {
      owner: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const createArticle = async ({ data }) => {
  return await prismaClient.article.create({
    data,
    include: {
      owner: {
        select: {
          nickname: true,
        },
      },
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
  findById,
  updateArticle,
  createArticle,
  deleteArticle,
  existingLike,
  likeArticle,
  unlikeArticle,
};
