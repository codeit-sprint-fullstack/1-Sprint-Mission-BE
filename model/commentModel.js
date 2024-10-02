import prismaClient from "../utils/prismaClient.js";

const getArticleComments = async (cursor, limit, id) => {
  const data = await prismaClient.comment.findMany({
    where: { articleId: id },
    take: limit + 1, //추가적인 댓글이 있는지 확인
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createAt: "asc",
    },
  });
  return data;
};

const getProductComments = async (cursor, limit, id) => {
  const data = await prismaClient.comment.findMany({
    where: { productId: id },
    take: limit + 1, //추가적인 댓글이 있는지 확인
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createAt: "asc",
    },
  });
  return data;
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
  console.log(id);
  return prismaClient.comment.delete({
    where: {
      id,
    },
  });
};

export default {
  getArticleComments,
  getProductComments,
  createComment,
  updateComment,
  deleteComment,
};
