import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../asyncHandler.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  "/:articleId",
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { cursor } = req.query;
    const comments = await prisma.articleComment.findMany({
      where: { articleId: parseInt(articleId) },
      take: 10,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
    });
    res.status(200).json(comments);
  })
);

export default router;
