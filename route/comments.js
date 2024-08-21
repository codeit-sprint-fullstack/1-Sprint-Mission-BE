import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from './asyncHandler.js';
import { CreateComment, PatchComment } from './struct.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { cursor, limit, category } = req.query;
    const numericLimit = limit ? parseInt(limit, 10) : undefined;

    const queryOptions = {
      take: numericLimit,
      skip: cursor ? 1 : 0,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        article: {
          select: {
            category: true,
          },
        },
      },
    };

    if (category) {
      queryOptions.where = {
        article: {
          category:
            category === 'FreeboardComment'
              ? 'FreeboardComment'
              : 'MarketplaceComment',
        },
      };
    }

    const comments = await prisma.comment.findMany(queryOptions);
    res.send(comments);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comments = await prisma.comment.findUnique({
      where: { id },
    });
    res.send(comments);
  })
);

router.post(
  '/comments',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);
    const comments = await prisma.comment.create({
      data: req.body,
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
