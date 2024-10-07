import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import jwtMiddleware from '../middlewares/jwtMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  '/:id',
  jwtMiddleware.verifyAccessToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;

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

    res.status(200).json({ message: '좋아요가 추가되었습니다.' });
  })
);

router.delete(
  '/:id',
  jwtMiddleware.verifyAccessToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;

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
      return res.status(200).json({ message: '좋아요가 삭제됐습니다.' });
    }

    res.status(404).json({ message: '좋아요가 존재하지 않습니다.' });
  })
);

export default router;
