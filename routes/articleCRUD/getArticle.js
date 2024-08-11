import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(article);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
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
  })
);

export default router;
