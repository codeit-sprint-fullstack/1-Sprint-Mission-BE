// service/productCommentService.js
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../Common/asyncHandler.js";

const prisma = new PrismaClient();

export const createComment = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { content } = req.body;

  const comment = await prisma.productComment.create({
    data: {
      content,
      productId: parseInt(productId),
    },
  });
  res.status(201).json(comment);
});

export const getComments = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { cursor } = req.query;

  const comments = await prisma.productComment.findMany({
    where: { productId: parseInt(productId) },
    take: 10,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: parseInt(cursor) } : undefined,
  });

  res.status(200).json(comments);
});

export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await prisma.productComment.update({
    where: { id: parseInt(id) },
    data: { content },
  });
  res.status(200).json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.productComment.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).end();
});
