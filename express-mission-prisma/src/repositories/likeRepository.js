import prisma from "../config/prisma.js";

async function getByFillter(fillter) {
  return await prisma.like.findFirst({
    where: fillter,
  });
}

async function createArticleAndRelatedData(transactionData) {
  const { likeIdentifiers, countFillter, userId, articleId } = transactionData;
  return await prisma.$transaction([
    prisma.like.create({ data: likeIdentifiers }),
    prisma.like.count({ where: countFillter }),
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.article.findFirstOrThrow({ where: { id: articleId } }),
  ]);
}

async function createProductAndRelatedData(transactionData) {
  const { likeIdentifiers, countFillter, userId, productId } = transactionData;
  return await prisma.$transaction([
    prisma.like.create({ data: likeIdentifiers }),
    prisma.like.count({ where: countFillter }),
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.product.findFirstOrThrow({ where: { id: productId } }),
  ]);
}

async function deleteArticleAndRelatedData(transactionData) {
  const { likeIdentifiers, countFillter, userId, articleId } = transactionData;
  return await prisma.$transaction([
    prisma.like.delete({ where: likeIdentifiers }),
    prisma.like.count({ where: countFillter }),
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.article.findFirstOrThrow({ where: { id: articleId } }),
  ]);
}

async function deleteProductAndRelatedData(transactionData) {
  const { likeIdentifiers, countFillter, userId, productId } = transactionData;
  return await prisma.$transaction([
    prisma.like.delete({ where: likeIdentifiers }),
    prisma.like.count({ where: countFillter }),
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.product.findFirstOrThrow({ where: { id: productId } }),
  ]);
}

export default {
  getByFillter,
  createArticleAndRelatedData,
  createProductAndRelatedData,
  deleteArticleAndRelatedData,
  deleteProductAndRelatedData,
};
