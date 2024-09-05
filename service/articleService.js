// service/articleService.js
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../Common/asyncHandler.js";

const prisma = new PrismaClient();

export const createArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const article = await prisma.article.create({
    data: { title, content },
  });
  res.status(201).json(article);
});

export const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUnique({
    where: { id: parseInt(id) },
  });
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  res.status(200).json(article);
});

export const getArticles = asyncHandler(async (req, res) => {
  const { page = 1, size = 10, search = "", sort = "createdAt" } = req.query;
  const offset = (page - 1) * size;

  // 정렬 기준 설정: 최신순('createdAt') 또는 좋아요순('favorite')
  let orderBy;
  if (sort === "favorite") {
    orderBy = { favorite: "desc" }; // 좋아요순으로 정렬
  } else {
    orderBy = { createdAt: "desc" }; // 최신순으로 정렬 (기본값)
  }

  const articles = await prisma.article.findMany({
    where: {
      OR: [{ title: { contains: search } }, { content: { contains: search } }],
    },
    skip: parseInt(offset),
    take: parseInt(size),
    orderBy, // 동적 정렬 적용
  });

  const total = await prisma.article.count({
    where: {
      OR: [{ title: { contains: search } }, { content: { contains: search } }],
    },
  });

  res.status(200).json({
    total,
    pages: Math.ceil(total / size),
    data: articles,
  });
});

export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const article = await prisma.article.update({
    where: { id: parseInt(id) },
    data: { title, content },
  });
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  res.status(200).json(article);
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.article.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).end();
});
