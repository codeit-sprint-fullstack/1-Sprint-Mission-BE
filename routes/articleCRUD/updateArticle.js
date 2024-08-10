import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.patch("/:id", async (req, res) => {
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

export default router;
