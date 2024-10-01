import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import { CreateArticle, PatchArticle } from './struct.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  '/:category',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 5, keyword = '', sort = 'recent' } = req.query;
    const { category } = req.params;

    const offset = (page - 1) * limit;

    let orderBy;
    if (sort === 'recent') {
      orderBy = [{ createdAt: 'desc' }, { id: 'desc' }];
    } else {
      orderBy = [{ createdAt: 'asc' }, { id: 'desc' }];
    }

    const articles = await prisma.article.findMany({
      where: {
        category,
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

    const total = await prisma.article.count({
      where: {
        category,
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
      pages: Math.ceil(total / limit),
      data: articles,
    });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id },
    });
    res.send(article);
  })
);

router.post(
  '/:category',
  asyncHandler(async (req, res) => {
    const { category } = req.params;

    const article = await prisma.article.create({
      data: {
        ...req.body,
        category,
      },
    });
    res.status(201).send(article);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    assert(req.body, PatchArticle);
    const { id } = req.params;
    const article = await prisma.article.update({
      where: { id },
      data: req.body,
    });
    res.send(article);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

export default router;
