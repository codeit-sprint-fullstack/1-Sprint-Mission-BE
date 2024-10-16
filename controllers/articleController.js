import prisma from "../prismaClient.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import CustomError from "../utils/customError.js";

// 게시글 생성
export const createArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const article = await prisma.article.create({
    data: { title, content },
  });
  res.status(201).json(article);
});

// 게시글 조회
export const getArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUnique({
    where: { id: parseInt(id) },
  });
  if (!article) {
    throw new CustomError("게시글이 존재하지 않습니다", 404);
  }
  res.status(200).json(article);
});

// 게시글 수정
export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const article = await prisma.article.update({
    where: { id: parseInt(id) },
    data: { title, content },
  });
  res.status(200).json(article);
});

// 게시글 삭제
export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.article.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).send();
});

// 게시글 목록 조회
export const listArticles = asyncHandler(async (req, res) => {
  const { page = 1, size = 10, sort = "createdAt", search = "" } = req.query;
  const skip = (page - 1) * size;
  const articles = await prisma.article.findMany({
    where: {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    },
    skip: parseInt(skip),
    take: parseInt(size),
    orderBy: { [sort]: "desc" },
  });
  res.status(200).json(articles);
});
