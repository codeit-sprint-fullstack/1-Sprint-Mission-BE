import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const router = express.Router();
const prisma = new PrismaClient();

// 중고마켓 댓글 목록 조회
router.get(
  "/market/:articleId/comments",
  asyncHandler(async (req, res) => {
    const { cursor, take = 10 } = req.query;
    const { articleId } = req.params;

    const comments = await prisma.comment.findMany({
      where: {
        articleId: articleId,
        category: "MARKET",
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: Number(take),
    });

    const nextCursor =
      comments.length === Number(take)
        ? comments[comments.length - 1].id
        : null;

    res.send({
      comments,
      nextCursor,
    });
  })
);

// 자유게시판 댓글 목록 조회
router.get(
  "/board/:articleId/comments",
  asyncHandler(async (req, res) => {
    const { cursor, take = 10 } = req.query;
    const { articleId } = req.params;

    const comments = await prisma.comment.findMany({
      where: {
        articleId: articleId,
        category: "BOARD",
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: Number(take),
    });

    const nextCursor =
      comments.length === Number(take)
        ? comments[comments.length - 1].id
        : null;

    res.send({
      comments,
      nextCursor,
    });
  })
);

// 중고마켓 댓글 등록
router.post(
  "/market/:articleId/comments",
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const comment = await prisma.comment.create({
      data: {
        ...req.body,
        articleId: articleId,
        category: "MARKET",
      },
    });
    res.status(201).send(comment);
  })
);

// 자유게시판 댓글 등록
router.post(
  "/board/:articleId/comments",
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const comment = await prisma.comment.create({
      data: {
        ...req.body,
        articleId: articleId,
        category: "BOARD",
      },
    });
    res.status(201).send(comment);
  })
);

// 댓글 수정
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    try {
      const updatedComment = await prisma.comment.update({
        where: { id: id },
        data: req.body,
      });
      res.send(updatedComment);
    } catch (error) {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);

// 댓글 삭제
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    try {
      await prisma.comment.delete({
        where: { id: id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);

export default router;
