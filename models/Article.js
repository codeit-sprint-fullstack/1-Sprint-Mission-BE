import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createArticle = async (data) => {
  return await prisma.article.create({ data });
};

export const getArticleById = async (id) => {
  return await prisma.article.findUnique({ where: { id: Number(id) } });
};

export const updateArticle = async (id, data) => {
  return await prisma.article.update({ where: { id: Number(id) }, data });
};

export const deleteArticle = async (id) => {
  return await prisma.article.delete({ where: { id: Number(id) } });
};

export const getArticles = async (options) => {
  return await prisma.article.findMany(options);
};
