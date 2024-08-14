import prisma from "../prismaClient.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// 댓글쓰기
export const createComment = asyncHandler(async (req, res) => {
  const { content, articleId, marketItemId } = req.body;
  const comment = await prisma.comment.create({
    data: { content, articleId, marketItemId },
  });
  res.status(201).json(comment);
});

// 댓글 수정
export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await prisma.comment.update({
    where: { id: parseInt(id) },
    data: { content },
  });
  res.status(200).json(comment);
});

// 댓글 삭제
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.comment.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).send();
});

// 댓글 목록 나열
export const listComments = asyncHandler(async (req, res) => {
  const { articleId, marketItemId, page = 1, size = 10 } = req.query;
  const skip = (page - 1) * size;
  const comments = await prisma.comment.findMany({
    where: {
      AND: [
        { articleId: articleId ? parseInt(articleId) : undefined },
        { marketItemId: marketItemId ? parseInt(marketItemId) : undefined },
      ],
    },
    skip: parseInt(skip),
    take: parseInt(size),
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json(comments);
});
