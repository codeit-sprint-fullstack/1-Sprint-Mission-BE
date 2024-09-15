import express from 'express';
import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { CreateComment, PatchComment } from '../structs.js';
import asyncHandler from '../utils/asyncHandler.js';

const prisma = new PrismaClient();
const router = express.Router({ mergeParams: true });

// 댓글 목록조회 API //id, content, createdAt를 조회합니다. cursor적용
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { cursor, limit = 10 } = req.query;
    let query = {
      take: parseInt(limit),
      where: { articleId: articleId },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    };
    if (cursor) {
      query.cursor = {
        id: cursor,
      };
      query.skip = 1;
    }
    const comment = await prisma.comment.findMany(query);
    res.send(comment);
  })
);

// content를 입력하여 댓글을 등록합니다.
router.post(
  '/',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);
    const { content } = req.body;
    const { articleId } = req.params;

    const comment = await prisma.comment.create({
      data: {
        content,
        article: {
          connect: { id: articleId },
        },
      },
    });
    res.status(201).send(comment);
  })
);

// 댓글 수정 API
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    assert(req.body, PatchComment);
    const { id } = req.params;
    const comment = await prisma.comment.update({
      where: { id },
      data: req.body,
    });
    res.send(comment);
  })
);

// 댓글 삭제 API
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
