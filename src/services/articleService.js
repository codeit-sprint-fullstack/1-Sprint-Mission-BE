import { prisma } from "../utils/prisma.js";

export const createArticle = async (data) => {
  return prisma.article.create({ data });
};

export const getArticles = async (skip, take, orderBy) => {
  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      skip,
      take,
      orderBy,
      include: { writer: { select: { id: true, nickname: true } } },
    }),
    prisma.article.count(),
  ]);

  return { articles, totalCount };
};
