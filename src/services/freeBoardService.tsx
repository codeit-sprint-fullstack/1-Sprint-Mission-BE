import { PrismaClient } from '@prisma/client';
import { createError } from '../utils/error';

export interface FreeBoardValues {
  age: number;
  limit: number;
  keyword: string;
  sort: string;
  userId: string;
  page: string | undefined;
}

const prisma = new PrismaClient();

export const getFreeBoard = async ({
  page,
  limit,
  keyword,
  sort,
}: FreeBoardValues) => {
  const offset = (Number(page || 0) - 1) * Number(limit);

  let orderBy: {
    createdAt?: 'asc' | 'desc';
    id?: 'asc' | 'desc';
    favoriteCount?: 'asc' | 'desc';
  }[];

  if (sort === 'recent') {
    orderBy = [{ createdAt: 'desc' }, { id: 'desc' }];
  } else {
    orderBy = [
      { favoriteCount: 'desc' },
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
    take: Number(limit),
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

export const getFreeBoardDetail = async (id: string, userId: any) => {
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
    createError('게시물이 존재하지 않습니다', 404, 404);
  }

  return article;
};

export const postFreeBoard = async (
  title: string,
  content: string,
  tags: string[],
  userId: string
) => {
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

export const editFreeBoard = async (
  title: string,
  content: string,
  id: string
) => {
  const article = await prisma.freeBoard.update({
    where: { id: Number(id) },
    data: { title, content },
  });

  return article;
};

export const deleteFreeBoard = async (id: string) => {
  await prisma.freeBoard.delete({
    where: {
      id: Number(id),
    },
  });
};
