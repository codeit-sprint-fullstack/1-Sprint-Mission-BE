import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const postFavorite = async (id, userId) => {
  await prisma.$transaction([
    prisma.favorite.create({
      data: {
        fleaMarketId: Number(id),
        userId: userId,
      },
    }),
    prisma.fleaMarket.update({
      where: { id: Number(id) },
      data: { favoriteCount: { increment: 1 } },
    }),
  ]);
};

export const deleteFavorite = async (id, userId) => {
  const existingFavorite = await prisma.favorite.findFirst({
    where: {
      userId: userId,
      fleaMarketId: Number(id),
    },
  });

  if (existingFavorite) {
    await prisma.$transaction([
      prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      }),
      prisma.fleaMarket.update({
        where: { id: Number(id) },
        data: { favoriteCount: { decrement: 1 } },
      }),
    ]);
  } else {
    const error = new Error('좋아요가 존재하지 않습니다');
    error.code = 404;
    error.status = 404;
    throw error;
  }
};
