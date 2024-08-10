import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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

export default router;
