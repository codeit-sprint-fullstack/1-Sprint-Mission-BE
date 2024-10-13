import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFreeBoard = async (page, limit, keyword, sort, userId) => {
  const offset = (page - 1) * limit;

  let orderBy;
  if (sort === 'recent') {
    orderBy = [{ createdAt: 'desc' }, { id: 'desc' }];
  } else {
    orderBy = [
      { favorite: { _count: 'desc' } },
      { createdAt: 'desc' },
      { id: 'desc' },
    ];
  }

  const articles = await prisma.freeBoard.findMany({
    where: {
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { content: { contains: keyword, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      user: {
        select: {
          nickname: true,
          image: true,
        },
      },
      comment: {
        select: {
          id: true,
        },
      },
      favorite: {
        select: {
          userId: true,
        },
      },
    },
    orderBy,
    skip: offset,
    take: parseInt(limit, 10),
  });

  const total = await prisma.freeBoard.count({
    where: {
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { content: { contains: keyword, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
  });

  return {
    total,
    totalPages: Math.ceil(total / limit),
    articles,
  };
};

export const getFreeBoardDetail = async (id, userId) => {
  const article = await prisma.freeBoard.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          nickname: true,
          image: true,
        },
      },
      favorite: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!article) {
    const error = new Error('게시물이 존재하지 않습니다');
    error.code = 404;
    error.status = 404;
    throw error;
  }

  return article;
};

export const postFreeBoard = async (title, content, tags, userId) => {
  const article = await prisma.freeBoard.create({
    data: {
      title: title,
      content: content,
      tags,
      userId,
    },
  });

  return article;
};

export const editFreeBoard = async (title, content, id, req) => {
  const article = await prisma.freeBoard.update({
    where: { id: Number(id) },
    data: { title, content },
  });

  return article;
};

export const deleteFreeBoard = async (id) => {
  await prisma.freeBoard.delete({
    where: {
      id: Number(id),
    },
  });
};
