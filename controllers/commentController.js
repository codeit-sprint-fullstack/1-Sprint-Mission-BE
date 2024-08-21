import prisma from "../prismaClient.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// 중고템 댓글 등록
export const createMarketComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { marketItemId } = req; // req.params에서 marketItemId 가져오기
  const comment = await prisma.comment.create({
    data: { content, marketItemId: parseInt(marketItemId) },
  });
  res.status(201).json(comment);
});

// 게시판 댓글 등록
export const createArticleComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { articleId } = req; // req.params에서 articleId 가져오기
  const comment = await prisma.comment.create({
    data: { content, articleId: parseInt(articleId) },
  });
  res.status(201).json(comment);
});

// 중고템 댓글 수정
export const updateMarketComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await prisma.comment.update({
    where: { id: parseInt(id) },
    data: { content },
  });
  res.status(200).json(comment);
});

// 게시판 댓글 수정
export const updateArticleComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await prisma.comment.update({
    where: { id: parseInt(id) },
    data: { content },
  });
  res.status(200).json(comment);
});

// 중고템 댓글 삭제
export const deleteMarketComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 게시판 댓글 삭제
export const deleteArticleComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 중고템 댓글 목록 조회
export const listMarketComments = asyncHandler(async (req, res) => {
  const { cursor, size = 10 } = req.query;
  const { marketItemId } = req; // req.params에서 marketItemId 가져오기
  const comments = await prisma.comment.findMany({
    where: { marketItemId: parseInt(marketItemId) },
    take: parseInt(size),
    cursor: cursor ? { id: parseInt(cursor) } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json(comments);
});

// 게시판 댓글 목록 조회
export const listArticleComments = asyncHandler(async (req, res) => {
  const { cursor, size = 10 } = req.query;
  const { articleId } = req; // req.params에서 articleId 가져오기
  const comments = await prisma.comment.findMany({
    where: { articleId: parseInt(articleId) },
    take: parseInt(size),
    cursor: cursor ? { id: parseInt(cursor) } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json(comments);
});
