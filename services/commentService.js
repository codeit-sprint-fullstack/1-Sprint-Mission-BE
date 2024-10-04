import prisma from "../models/index.js";

export const createProductComment = async (content, userId, productId) => {
  const newComment = await prisma.comment.create({
    data: {
      content,
      userId,
      productId,
    },
    include: {
      writer: true,
    },
  });

  return newComment;
};

export const getProductComments = async (limit, cursor, productId) => {
  const queryOptions = {
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      writer: true,
    },
    where: {
      productId: parseInt(productId),
    },
  };

  if (cursor) {
    queryOptions.cursor = { id: parseInt(cursor) };
    queryOptions.skip = 1;
  }

  const list = await prisma.comment.findMany(queryOptions);
  const nextCursor = list.length === limit ? list[list.length - 1].id : null;

  return { list, nextCursor };
};

export const createArticleComment = async (content, userId, articleId) => {
  const newComment = await prisma.comment.create({
    data: {
      content,
      userId,
      articleId,
    },
    include: {
      writer: true,
    },
  });

  return newComment;
};

export const getArticleComments = async (limit, cursor, articleId) => {
  const queryOptions = {
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      writer: true,
    },
    where: {
      articleId: parseInt(articleId),
    },
  };

  if (cursor) {
    queryOptions.cursor = { id: parseInt(cursor) };
    queryOptions.skip = 1;
  }

  const list = await prisma.comment.findMany(queryOptions);
  const nextCursor = list.length === limit ? list[list.length - 1].id : null;

  return { list, nextCursor };
};

export const updateComment = async (commentId, content) => {
  const updateComment = await prisma.comment.update({
    where: { id: parseInt(commentId) },
    data: {
      content: content,
    },
  });

  return updateComment;
};

export const deleteComment = async (commentId) => {
  await prisma.comment.delete({ where: { id: parseInt(commentId) } });
};
