import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router();

router.patch(
  "/:mongoProductId/comments/:id",
  asyncHandler(async (req, res) => {
    const { mongoProductId, id } = req.params;
    const { content } = req.body;

    const comment = await prisma.productComment.findFirst({
      where: {
        id: parseInt(id),
        productId: mongoProductId,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const updatedComment = await prisma.productComment.update({
      where: { id: comment.id },
      data: { content },
    });

    res.status(200).json(updatedComment);
  })
);

export default router;
