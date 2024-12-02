import { PrismaClient } from '@prisma/client';
import { createError } from '../utils/error';

export interface FleaMarketValues {
  page: number;
  limit: number;
  keyword: string | undefined;
  sort: string | undefined;
  userId: string | undefined;
}

export interface FleaMarketArticle {
  title: string;
  content: string;
  price: string;
  tags: any;
  userId: any;
  id: string | undefined;
  req: any;
}

const prisma = new PrismaClient();

export const getFleaMarket = async ({
  page,
  limit,
  keyword,
  sort,
  userId,
}: FleaMarketValues) => {
  const offset = (page - 1) * limit;

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

  const articles = await prisma.fleaMarket.findMany({
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
      favorite: true,
    },
    orderBy,
    skip: offset,
    take: Number(limit),
  });

  const articlesWithIsLiked = articles.map((article: any) => {
    const isLiked = userId
      ? article.favorite?.some((fav: any) => fav.userId === userId) ?? false
      : false;
    return {
      ...article,
      isLiked,
    };
  });

  const total = await prisma.fleaMarket.count({
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
    data: articlesWithIsLiked,
  };
};

export const getFleaMarketDetail = async (id: string, userId: any) => {
  const article = await prisma.fleaMarket.findUnique({
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

  const isLiked = userId
    ? article?.favorite.some((fav: any) => fav.userId === userId)
    : false;

  if (!article) {
    createError('게시물이 존재하지 않습니다', 404, 404);
  }

  return { article, isLiked };
};

export const deleteFleaMarket = async (id: string) => {
  await prisma.fleaMarket.delete({
    where: {
      id: Number(id),
    },
  });
};

export const postFleaMarket = async ({
  title,
  content,
  price,
  tags,
  userId,
  req,
}: FleaMarketArticle) => {
  const imagePaths = req.files ? req.files.map((file: any) => file.path) : [];
  const tagsArray = tags ? tags.split(',') : [];

  const article = await prisma.fleaMarket.create({
    data: {
      title: title,
      content: content,
      price: Number(price),
      tags: tagsArray,
      images: imagePaths,
      userId: userId,
    },
  });

  return article;
};

export const editFleaMarket = async ({
  title,
  content,
  price,
  tags,
  id,
  req,
}: FleaMarketArticle) => {
  const imagePaths = req.files ? req.files.map((file: any) => file.path) : [];
  const tagsArray = tags ? tags.split(',') : [];

  const article = await prisma.fleaMarket.update({
    where: { id: Number(id) },
    data: {
      title: title,
      content: content,
      price: Number(price),
      tags: tagsArray,
      images: imagePaths,
    },
  });

  return article;
};
