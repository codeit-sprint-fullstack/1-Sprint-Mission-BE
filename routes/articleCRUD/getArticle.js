import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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
