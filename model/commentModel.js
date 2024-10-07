import prismaClient from "../utils/prismaClient.js";

const getArticleComments = async (cursor, limit, id) => {
  const takeCount = parseInt(limit + 1);
  return prismaClient.comment.findMany({
    where: { articleId: id },
    take: takeCount, //추가적인 댓글이 있는지 확인
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createAt: "desc",
    },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const getProductComments = async (cursor, limit, id) => {
  const takeCount = parseInt(limit + 1);
  return prismaClient.comment.findMany({
    where: { productId: id },
    take: takeCount, //추가적인 댓글이 있는지 확인
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createAt: "desc",
    },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const getById = async (id) => {
  return prismaClient.comment.findUniqueOrThrow({
    where: {
      id,
    },
  });
};

const createComment = async (data) => {
  return prismaClient.comment.create({
    data,
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const updateComment = async ({ content, commentId, userId }) => {
  return prismaClient.comment.update({
    where: {
      id: commentId,
    },
    data: {
      userId,
      content,
    },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const deleteComment = async (id) => {
  return prismaClient.comment.delete({
    where: {
      id,
    },
  });
};

export default {
  getArticleComments,
  getProductComments,
  getById,
  createComment,
  updateComment,
  deleteComment,
};
