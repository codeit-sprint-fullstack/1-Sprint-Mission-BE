import express from 'express';
import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs.js';
import asyncHandler from '../utils/asyncHandler.js';

const prisma = new PrismaClient();
const router = express.Router();

// 게시글 조회 API //id, title, content, createdAt를 조회합니다.
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    res.send(article);
  })
);

// 게시글 목록조회 API //id, title, content, createdAt를 조회합니다. offset적용, recent정렬, title, content로 검색
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { offset = 0, limit = 10, order = 'recent', search = '' } = req.query;
    let orderBy;
    switch (order) {
      case 'old':
        orderBy = { createdAt: 'desc' };
        break;
      case 'recent':
      default:
        orderBy = { createdAt: 'asc' };
    }
    const article = await prisma.article.findMany({
      skip: parseInt(offset),
      take: parseInt(limit),
      orderBy,
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    res.send(article);
  })
);

// 게시글 등록 API //title, content를 입력해 게시글을 등록합니다.
router.post(
  '/',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateArticle);
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.send(article);
  })
);

// 게시글 수정 API
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

// 게시글 삭제 API
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id },
    });
    res.send(204);
  })
);

export default router;
