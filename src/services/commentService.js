import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getComments = async (
  cursor,
  limit,
  articleId,
  articleCategory
) => {
  const numericLimit = limit ? Number(limit) : 5;
  const cursorValue = cursor ? Number(cursor) : null;

  let comments;

  if (articleCategory === 'freeboard') {
    comments = await prisma.comment.findMany({
      take: numericLimit,
      ...(cursorValue && { cursor: { id: cursorValue } }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      where: {
        freeBoardId: Number(articleId),
      },
      include: {
        user: true,
      },
    });
  } else if (articleCategory === 'fleamarket') {
    comments = await prisma.comment.findMany({
      take: numericLimit,
      ...(cursorValue && { cursor: { id: cursorValue } }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      where: {
        fleaMarketId: Number(articleId),
      },
      include: {
        user: true,
      },
    });
  }

  const totalCount = await prisma.comment.count({
    where:
      articleCategory === 'freeboard'
        ? { freeBoardId: Number(articleId) }
        : { fleaMarketId: Number(articleId) },
  });

  return { totalCount, comments };
};

export const postComment = async (
  articleId,
  articleCategory,
  content,
  userId
) => {
  let comments;

  if (articleCategory === 'freeboard') {
    comments = await prisma.comment.create({
      data: {
        content: content,
        userId: userId,
        freeBoardId: Number(articleId),
      },
      include: {
        user: true,
      },
    });
  } else if (articleCategory === 'fleamarket') {
    comments = await prisma.comment.create({
      data: {
        content: content,
        userId: userId,
        fleaMarketId: Number(articleId),
      },
      include: {
        user: true,
      },
    });
  }

  return comments;
};

export const editComment = async (id, content) => {
  const comments = await prisma.comment.update({
    where: {
      id: Number(id),
    },
    data: {
      content: content,
    },
    include: {
      user: true,
    },
  });

  return comments;
};

export const deleteComment = async (id) => {
  await prisma.comment.delete({
    where: {
      id: Number(id),
    },
  });
};
