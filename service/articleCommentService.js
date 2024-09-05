// service/articleCommentService.js
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../Common/asyncHandler.js";

const prisma = new PrismaClient();

export const createArticleComment = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;

  const comment = await prisma.articleComment.create({
    data: {
      content,
      articleId: parseInt(articleId),
    },
  });
  res.status(201).json(comment);
});

export const getArticleComments = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { offset = 0 } = req.query;

  const comments = await prisma.articleComment.findMany({
    where: { articleId: parseInt(articleId) },
    take: 10,
    skip: parseInt(offset),
    orderBy: { id: "asc" },
  });

  res.status(200).json(comments);
});

export const updateArticleComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await prisma.articleComment.update({
    where: { id: parseInt(id) },
    data: { content },
  });
  res.status(200).json(comment);
});

export const deleteArticleComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.articleComment.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).end();
});
