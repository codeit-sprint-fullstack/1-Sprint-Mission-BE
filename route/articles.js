import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import { CreateArticle, PatchArticle } from './struct.js';
import assert from 'assert';

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 5,
      keyword = '',
      sort = 'recent',
      category,
    } = req.query;

    const offset = (page - 1) * limit;

    let orderBy;
    if (sort === 'recent') {
      orderBy = [{ createdAt: 'asc' }, { id: 'desc' }];
      orderBy = [{ createdAt: 'desc' }, { id: 'desc' }];
    }

    const articles = await prisma.article.findMany({
      where: {
        category: category,
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
        category: category,
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
  '/:articleID',
  asyncHandler(async (req, res) => {
    const { articleID } = req.params;
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(articleID, 10), // 정수형으로 변환 후 사용
      },
      include: {
        user: true,
      },
    });
    res.send(article);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateArticle);
    const article = await prisma.article.create({
      data: req.body,
    });
    res.status(201).send(article);
  })
);

router.patch(
  '/:articleID',
  asyncHandler(async (req, res) => {
    assert(req.body, PatchArticle);
    const { articleID } = req.params;
    const article = await prisma.article.update({
      where: {
        id: parseInt(articleID, 10), // 정수형으로 변환 후 사용
      },
      data: req.body,
    });
    res.send(article);
  })
);

router.delete(
  '/:articleID',
  asyncHandler(async (req, res) => {
    const { articleID } = req.params;
    await prisma.article.delete({
      where: {
        id: parseInt(articleID, 10), // 정수형으로 변환 후 사용
      },
    });
    res.sendStatus(204);
  })
);

export default router;
