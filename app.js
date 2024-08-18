import express from 'express';
import * as dotenv from 'dotenv';
import { assert } from 'superstruct';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateArticle, PatchArticle } from './structs.js';

dotenv.config();
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === 'StructError' || e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).send({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

// 게시물 등록
app.post(
  '/article',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateArticle);
    const article = await prisma.article.create({
      data: req.body,
    });
    res.status(201).send(article);
  })
);

// 상세 게시물 조회
app.get(
  '/article/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUniqueOrThrow({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
      where: { id },
    });
    res.send(article);
  })
);

// 상세 게시물 수정
app.patch(
  '/article/:id',
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

// 상세 스터디 삭제
app.delete(
  '/article/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

// 게시물 목록 조회
app.get(
  '/article',
  asyncHandler(async (req, res) => {
    const { offset = 0, limit = 5, order = 'newest', search = '' } = req.query;
    let orderBy;
    switch (order) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
      where: {
        OR: [{ content: { contains: search } }, { title: { contains: search } }],
      },
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
    });
    res.send(articles);
  })
);

// 게시물 댓글 등록
app.post(
  '/article/:id/comment',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comment = await prisma.comment.create({
      data: {
        ...req.body,
        articleId: id,
      },
    });
    res.status(201).send(comment);
  })
);

// 중고마켓 댓글 등록
app.post(
  '/product/:id/comment',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comment = await prisma.productComment.create({
      data: {
        ...req.body,
        productId: id,
      },
    });
    res.status(201).send(comment);
  })
);

// 게시물 댓글 수정
app.patch(
  '/comment/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateComment = await prisma.comment.update({
      where: { id },
      data: req.body,
    });
    res.status(200).send(updateComment);
  })
);

// 게시물 삭제
app.delete(
  '/comment/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.comment.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

// 자유게시판 댓글 목록 조회
app.get(
  '/comment',
  asyncHandler(async (req, res) => {
    const { cursor, limit = 5 } = req.query;
    const parsedLimit = parseInt(limit);

    const comments = await prisma.comment.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      take: parsedLimit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.send(comments);
  })
);

// 중고마켓 댓글 목록 조회
app.get(
  '/productcomment',
  asyncHandler(async (req, res) => {
    const { cursor, limit = 5 } = req.query;
    const parsedLimit = parseInt(limit);

    const comments = await prisma.productComment.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      take: parsedLimit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.send(comments);
  })
);

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
