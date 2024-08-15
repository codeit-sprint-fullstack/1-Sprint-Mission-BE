import express from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
const prisma = new PrismaClient();

// 게시글 목록 조회
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page = 1, pageSize = 10, keyword = "" } = req.query;
    const offset = (page - 1) * pageSize;

    const searchQuery = keyword
      ? {
          OR: [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
          ],
        }
      : {};

    const totalArticles = await prisma.article.count({ where: searchQuery });
    const articles = await prisma.article.findMany({
      where: searchQuery,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: Number(pageSize),
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    res.send({ totalArticles, articles });
  })
);

// 게시글 조회
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const article = await prisma.article.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (article) {
      res.send(article);
    } else {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);

// 게시글 등록
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const article = await prisma.article.create({
      data: req.body,
    });
    res.status(201).send(article);
  })
);

// 게시글 수정
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const article = await prisma.article.update({
        where: { id: id },
        data: req.body,
      });
      res.send(article);
    } catch (error) {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);

// 게시글 삭제
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      await prisma.article.delete({
        where: { id: id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);

export default router;
