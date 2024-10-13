import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const postFavorite = async (articleCategory, articleId, userId) => {
  const favoriteData = getFavoriteData(articleCategory, articleId);
  const getArticleCategory = getCategory(articleCategory);

  await prisma.$transaction([
    prisma.favorite.create({
      data: {
        userId: userId,
        ...favoriteData,
      },
    }),
    prisma[getArticleCategory].update({
      where: { id: Number(articleId) },
      data: { favoriteCount: { increment: 1 } },
    }),
  ]);
};

export const deleteFavorite = async (articleCategory, articleId, userId) => {
  const favoriteData = getFavoriteData(articleCategory, articleId);
  const getArticleCategory = getCategory(articleCategory);

  const existingFavorite = await prisma.favorite.findFirst({
    where: {
      userId: userId,
      ...favoriteData,
    },
  });

  if (!existingFavorite) {
    throw new Error('좋아요가 존재하지 않습니다');
  }

  await prisma.$transaction([
    prisma.favorite.delete({ where: { id: existingFavorite.id } }),
    prisma[getArticleCategory].update({
      where: { id: Number(articleId) },
      data: { favoriteCount: { decrement: 1 } },
    }),
  ]);
};

const getFavoriteData = (articleCategory, articleId) => {
  if (articleCategory === 'fleamarket') {
    return { fleaMarketId: Number(articleId) };
  } else {
    return { freeBoardId: Number(articleId) };
  }
};

const getCategory = (articleCategory) => {
  if (articleCategory === 'fleamarket') {
    return 'fleaMarket';
  } else {
    return 'freeBoard';
  }
};
