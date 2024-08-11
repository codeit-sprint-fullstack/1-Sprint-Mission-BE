import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const router = express.Router();
const prisma = new PrismaClient();

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await prisma.articleComment.update({
      where: { id: parseInt(id) },
      data: { content },
    });
    res.status(200).json(comment);
  })
);

export default router;
