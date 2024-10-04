import prisma from "../models/index.js";

const includeWriter = {
  writer: true,
};

const generateWhereCondition = (keyword) => {
  return keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};
};

const generateOrderCondition = (orderBy) => {
  if (orderBy === "favorite") {
    return { likeCount: "desc" };
  }
  return { createdAt: "desc" };
};

export const createArticle = async (image, content, title, userId) => {
  return prisma.article.create({
    data: { image, content, title, userId },
    include: includeWriter,
  });
};

export const getArticles = async (
  page = 1,
  pageSize = 10,
  keyword = "",
  orderBy = "recent"
) => {
  const offset = (page - 1) * pageSize;

  const [list, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      where: generateWhereCondition(keyword),
      skip: offset,
      take: pageSize,
      orderBy: generateOrderCondition(orderBy),
      include: includeWriter,
    }),
    prisma.article.count({
      where: generateWhereCondition(keyword),
    }),
  ]);

  return { list, totalCount, page, pageSize };
};

export const getArticleById = async (articleId) => {
  return prisma.article.findUnique({
    where: { id: parseInt(articleId) },
    include: includeWriter,
  });
};

export const updateArticle = async (articleId, image, title, content) => {
  return prisma.article.update({
    where: { id: parseInt(articleId) },
    data: { image, title, content },
    include: includeWriter,
  });
};

export const deleteArticle = async (articleId) => {
  await prisma.article.delete({ where: { id: parseInt(articleId) } });
};

export const addLike = async (articleId) => {
  return prisma.article.update({
    where: { id: parseInt(articleId) },
    data: {
      likeCount: { increment: 1 },
      isLike: true,
    },
    include: includeWriter,
  });
};

export const deleteLike = async (articleId) => {
  return prisma.article.update({
    where: { id: parseInt(articleId) },
    data: {
      likeCount: { decrement: 1 },
      isLike: false,
    },
    include: includeWriter,
  });
};
