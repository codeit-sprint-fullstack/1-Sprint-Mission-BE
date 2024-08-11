import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/:articleId",
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { content } = req.body;
    const comment = await prisma.articleComment.create({
      data: {
        content,
        articleId: parseInt(articleId),
      },
    });
    res.status(201).json(comment);
  })
);

export default router;
