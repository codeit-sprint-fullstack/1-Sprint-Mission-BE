import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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

export default router;
