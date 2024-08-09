import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// 댓글 등록 API
router.post("/:articleId", async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;
    const comment = await prisma.articleComment.create({
      data: {
        content,
        articleId: parseInt(articleId),
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 댓글 목록 조회 API
router.get("/:articleId", async (req, res) => {
  try {
    const { articleId } = req.params;
    const { cursor } = req.query;
    const comments = await prisma.articleComment.findMany({
      where: { articleId: parseInt(articleId) },
      take: 10,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: { createdAt: "asc" },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 댓글 수정 API
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await prisma.articleComment.update({
      where: { id: parseInt(id) },
      data: { content },
    });
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 댓글 삭제 API
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.articleComment.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
