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
  const { page = 1, size = 4 } = req.query;
  const offset = (page - 1) * size;

  const totalComments = await prisma.articleComment.count({
    where: { articleId: parseInt(articleId) },
  });

  const comments = await prisma.articleComment.findMany({
    where: { articleId: parseInt(articleId) },
    skip: parseInt(offset),
    take: parseInt(size),
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    total: totalComments,
    page: parseInt(page),
    size: parseInt(size),
    data: comments,
  });
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
