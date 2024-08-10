import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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
