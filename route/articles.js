import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import { CreateArticle, PatchArticle } from './struct.js';
import assert from 'assert';

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  '/freeboard',
  asyncHandler(async (req, res) => {
    const { cursor, limit, orderBy, keyword = '' } = req.query;
    const { freeboard } = req.params;

    const LimitValue = limit ? parseInt(limit, 10) : 6;
    const cursorValue = cursor ? parseInt(cursor, 10) : null;

    let orderByClause;
    switch (orderBy) {
      case 'recent':
        orderByClause = { createdAt: 'desc' };
        break;
      case 'old':
        orderByClause = { createdAt: 'asc' };
    }

    const queryOptions = {
      take: LimitValue,
      ...(cursorValue && { cursor: { id: cursorValue } }),
      orderBy: orderByClause,
      where: {
        category: freeboard,
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
    };

    const articles = await prisma.article.findMany(queryOptions);

    const nextCursor =
      articles.length > 0 ? articles[articles.length - 1].id : null;

    res.send({ articles, nextCursor });
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
