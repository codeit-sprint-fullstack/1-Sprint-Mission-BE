import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import { CreateArticle, PatchArticle } from './struct.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  '/:articleCategory/:articleId',
  asyncHandler(async (req, res) => {
    const { articleCategory, articleId } = req.params;

    let favorites;

    if (articleCategory === 'freeboard') {
      favorites = await prisma.favorite.create({
        data: {
          userId: req.body.userId,
          freeBoardId: Number(articleId),
        },
        include: {
          user: true,
        },
      });
    } else if (articleCategory === 'fleamarket') {
      favorites = await prisma.favorite.create({
        data: {
          userId: req.body.userId,
          fleaMarketId: Number(articleId),
        },
        include: {
          user: true,
        },
      });
    }
    res.status(201).json(favorites);
  })
);

router.delete(
  '/:articleCategory/:articleId',
  asyncHandler(async (req, res) => {
    const { articleCategory, articleId } = req.params;
    const { userId } = req.query;

    if (articleCategory === 'freeboard') {
      await prisma.favorite.deleteMany({
        where: {
          userId: userId,
          freeBoardId: Number(articleId),
        },
      });
    } else if (articleCategory === 'fleamarket') {
      await prisma.favorite.delete({
        where: {
          userId: userId,
          freeBoardId: Number(articleId),
        },
      });
    }

    res.sendStatus(204);
  })
);

export default router;
