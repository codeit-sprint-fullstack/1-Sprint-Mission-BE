import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();
router.get("/:mongoProductId/comments", async (req, res) => {
  try {
    const { mongoProductId } = req.params;

    const comments = await prisma.productComment.findMany({
      where: { productId: mongoProductId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
