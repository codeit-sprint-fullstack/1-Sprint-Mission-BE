import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.delete("/:mongoProductId/comments/:id", async (req, res) => {
  try {
    const { mongoProductId, id } = req.params;

    const comment = await prisma.productComment.findFirst({
      where: {
        id: parseInt(id),
        productId: mongoProductId,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await prisma.productComment.delete({
      where: { id: comment.id },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
