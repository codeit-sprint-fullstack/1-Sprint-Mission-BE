import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../Common/asyncHandler.js";

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

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.articleComment.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).end();
  })
);

export default router;
