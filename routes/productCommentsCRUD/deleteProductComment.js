import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router();

router.delete(
  "/:mongoProductId/comments/:id",
  asyncHandler(async (req, res) => {
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
  })
);

export default router;
