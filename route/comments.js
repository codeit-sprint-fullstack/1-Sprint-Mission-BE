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
    const { cursor, limit } = req.query;
    const { articleId } = req.params;
    const numericLimit = limit ? parseInt(limit, 10) : 0;

    const cursorValue = cursor ? parseInt(cursor, 10) : null;

    const queryOptions = {
      take: numericLimit,
      ...(cursorValue && { cursor: { id: cursorValue } }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      where: {
        articleId: parseInt(articleId, 10),
      },
      include: {
        user: true,
      },
    };

    const [comments, totalCount] = await prisma.$transaction([
      prisma.comment.findMany(queryOptions),
      prisma.comment.count({
        where: {
          articleId: parseInt(articleId, 10),
        },
      }),
    ]);
    res.send({ comments, totalCount });
  })
);

router.get(
  '/:articleId',
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const comments = await prisma.comment.findMany({
      where: {
        id: parseInt(articleId, 10), // 정수형으로 변환 후 사용
      },
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
      where: {
        id: parseInt(id, 10), // 정수형으로 변환 후 사용
      },
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
      where: {
        id: parseInt(id, 10), // 정수형으로 변환 후 사용
      },
    });
    res.sendStatus(204);
  })
);

export default router;
