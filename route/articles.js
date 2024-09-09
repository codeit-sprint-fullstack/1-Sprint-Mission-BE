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
      category = '',
      offset = 0,
      limit,
      orderBy = 'recent',
      keyword = '',
    } = req.query;

    const numericLimit = limit ? parseInt(limit, 10) : undefined;

    let orderByClause;
    switch (orderBy) {
      case 'recent':
        orderByClause = { createdAt: 'desc' };
        break;
      case 'old':
        orderByClause = { createdAt: 'asc' };
    }

    let categoryClause = '';

    if (category === 'fleamarket') {
      categoryClause = 'fleamarket';
    } else if (category === 'freeboard') {
      categoryClause = 'freeboard';
    } else {
      categoryClause = undefined;
    }

    const where = {
      category: categoryClause,
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { content: { contains: keyword, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const article = await prisma.article.findMany({
      where,
      orderBy: orderByClause,
      skip: parseInt(offset),
      take: numericLimit,
      include: {
        user: {
          select: {
            name: true, // 사용자 이름만 포함
          },
        },
        comment: {
          include: {
            user: {
              select: {
                name: true, // 댓글 작성자의 사용자 이름만 포함
              },
            },
          },
        },
      },
    });

    res.send(article);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true, // 사용자 이름만 포함
          },
        },
        comment: {
          include: {
            user: {
              select: {
                name: true, // 댓글 작성자의 사용자 이름만 포함
              },
            },
          },
        },
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
