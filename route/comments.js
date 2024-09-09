import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import { CreateComment, PatchComment } from './struct.js';
import assert from 'assert';

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  '/:articleId/',
  asyncHandler(async (req, res) => {
    const { cursor, limit, category, orderBy = 'recent' } = req.query;
    const { articleId } = req.params;
    const numericLimit = limit ? parseInt(limit, 10) : undefined;

    let orderByClause = { createdAt: 'asc' };
    switch (orderBy) {
      case 'recent':
        orderByClause = { createdAt: 'asc' };
        break;
      case 'old':
        orderByClause = { createdAt: 'desc' };
    }

    const queryOptions = {
      take: numericLimit,
      skip: cursor ? 1 : 0,
      orderBy: orderByClause,
      where: {
        articleId: articleId,
      },
      include: {
        user: true,
      },
    };

    const comments = await prisma.comment.findMany(queryOptions);
    res.send(comments);
  })
);

router.get(
  '/:articleId',
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { articleId },
      include: {
        user: true,
      },
    });
    res.send(comments);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);
    const comments = await prisma.comment.create({
      data: req.body,
      include: {
        user: true,
      },
    });
    res.status(201).send(comments);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    assert(req.body, PatchComment);
    const { id } = req.params;
    const comments = await prisma.comment.update({
      where: { id },
      data: req.body,
    });
    res.send(comments);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.comment.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

export default router;
