import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import { CreateArticle, PatchArticle } from './struct.js';

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
      orderBy = [{ createdAt: 'asc' }, { id: 'desc' }];
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
        user: true,
        comment: true,
      },
      orderBy,
      skip: offset,
      take: parseInt(limit, 10),
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

    res.status(200).json({
      total,
      totalPages: Math.ceil(total / limit),
      data: articles,
    });
  })
);

router.post(
  '/post',
  asyncHandler(async (req, res) => {
    const article = await prisma.fleaMarket.create({
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
    const article = await prisma.fleaMarket.findUnique({
      where: {
        id: Number(id),
        include: {
          user: true, // 필요에 따라 관련된 사용자 정보도 포함
        },
      },
    });

    res.status(200).json(article);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.fleaMarket.update({
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

    await prisma.fleaMarket.delete({
      where: {
        id: Number(id),
      },
    });
    res.sendStatus(204);
  })
);

export default router;
