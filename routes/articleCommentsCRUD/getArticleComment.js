import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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

export default router;
