import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createComment = async (data) => {
  return await prisma.comment.create({ data });
};

export const getCommentsByArticleId = async (articleId, options) => {
  return await prisma.comment.findMany({ where: { articleId: Number(articleId) }, ...options });
};

export const updateComment = async (id, data) => {
  return await prisma.comment.update({ where: { id: Number(id) }, data });
};

export const deleteComment = async (id) => {
  return await prisma.comment.delete({ where: { id: Number(id) } });
};
