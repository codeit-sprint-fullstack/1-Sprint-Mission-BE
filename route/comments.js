import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import { CreateComment, PatchComment } from './struct.js';
import assert from 'assert';

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  '/:articleCategory/:articleId',
  asyncHandler(async (req, res) => {
    const { cursor, limit } = req.query;
    const { articleId, articleCategory } = req.params;

    const numericLimit = limit ? Number(limit) : 5;
    const cursorValue = cursor ? Number(cursor) : null;

    let comments;

    if (articleCategory === 'freeboard') {
      comments = await prisma.comment.findMany({
        take: numericLimit,
        ...(cursorValue && { cursor: { id: cursorValue } }),
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        where: {
          freeBoardId: Number(articleId),
        },
        include: {
          user: true,
        },
      });
    } else if (articleCategory === 'fleamarket') {
      comments = await prisma.comment.findMany({
        take: numericLimit,
        ...(cursorValue && { cursor: { id: cursorValue } }),
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        where: {
          fleaMarketId: Number(articleId),
        },
        include: {
          user: true,
        },
      });
    }

    const totalCount = await prisma.comment.count({
      where:
        articleCategory === 'freeBoard'
          ? { freeBoardId: Number(articleId) }
          : { fleaMarketId: Number(articleId) },
    });

    res.send({ comments, totalCount });
  })
);

// router.get(
//   '/:articleId',
//   asyncHandler(async (req, res) => {
//     const { articleId } = req.params;
//     const comments = await prisma.comment.findMany({
//       where: {
//         id: Number(articleId), // 정수형으로 변환 후 사용
//       },
//       include: {
//         user: true,
//       },
//     });
//     res.send(comments);
//   })
// );

router.post(
  '/:articleCategory/:articleId',
  asyncHandler(async (req, res) => {
    const { articleId, articleCategory } = req.params;
    assert(req.body, CreateComment);

    let comments;
    if (articleCategory === 'freeboard') {
      comments = await prisma.comment.create({
        data: {
          content: req.body.content,
          userId: req.body.userId,
          freeBoardId: Number(articleId),
        },
        include: {
          user: true,
        },
      });
    }
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
        id: Number(id),
      },
      data: req.body,
      include: {
        user: true,
      },
    });

    res.status(201).send(comments);
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
