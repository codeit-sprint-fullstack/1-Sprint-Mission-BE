import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// 게시글 등록 API
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 게시글 조회 API
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 게시글 수정 API
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 게시글 삭제 API
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 게시글 목록 조회 API
router.get("/", async (req, res) => {
  try {
    const { page = 1, size = 10, search = "" } = req.query;
    const offset = (page - 1) * size;
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      },
      skip: parseInt(offset),
      take: parseInt(size),
      orderBy: { createdAt: "desc" },
    });
    const total = await prisma.article.count({
      where: {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      },
    });
    res.status(200).json({
      total,
      pages: Math.ceil(total / size),
      data: articles,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
