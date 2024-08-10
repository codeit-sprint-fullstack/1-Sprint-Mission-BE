import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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

export default router;
