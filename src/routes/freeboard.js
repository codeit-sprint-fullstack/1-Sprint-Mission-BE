import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import jwtMiddleware from '../middlewares/jwtMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 5, keyword = '', sort = 'recent' } = req.query;

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
        user: true,
        comment: true,
        favorite: true,
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

    res.status(200).json({
      total,
      totalPages: Math.ceil(total / limit),
      data: articles,
    });
  })
);

router.post(
  '/post',
  jwtMiddleware.verifyAccessToken,
  asyncHandler(async (req, res) => {
    const article = await prisma.freeBoard.create({
      data: {
        ...req.body,
      },
    });
    res.status(201).json(article);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.freeBoard.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        favorite: true,
      },
    });

    res.status(200).json(article);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.freeBoard.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.status(201).json(article);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.freeBoard.delete({
      where: {
        id: Number(id),
      },
    });
    res.sendStatus(204);
  })
);

export default router;
