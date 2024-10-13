import prisma from "../config/prisma.js";

async function getByfilter(filter) {
  return await prisma.like.findFirst({
    where: filter,
  });
}

async function createArticleAndRelatedData(transactionData) {
  const { likeIdentifiers, countfilter, userId, articleId } = transactionData;
  return await prisma.$transaction([
    prisma.like.create({ data: likeIdentifiers }),
    prisma.like.count({ where: countfilter }),
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.article.findFirstOrThrow({ where: { id: articleId } }),
  ]);
}

async function deleteArticleAndRelatedData(transactionData) {
  const { likeIdentifiers, countfilter, userId, articleId } = transactionData;
  return await prisma.$transaction([
    prisma.like.delete({ where: likeIdentifiers }),
    prisma.like.count({ where: countfilter }),
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.article.findFirstOrThrow({ where: { id: articleId } }),
  ]);
}

async function createProductAndRelatedData(transactionData) {
  const { likeIdentifiers, countfilter, userId, productId } = transactionData;
  return await prisma.$transaction([
    prisma.like.create({ data: likeIdentifiers }),
    prisma.like.count({ where: countfilter }),
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.product.findFirstOrThrow({ where: { id: productId } }),
  ]);
}

async function deleteProductAndRelatedData(transactionData) {
  const { likeIdentifiers, countfilter, userId, productId } = transactionData;
  return await prisma.$transaction([
    prisma.like.delete({ where: likeIdentifiers }),
    prisma.like.count({ where: countfilter }),
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.product.findFirstOrThrow({ where: { id: productId } }),
  ]);
}

export default {
  getByfilter,
  createArticleAndRelatedData,
  deleteArticleAndRelatedData,
  createProductAndRelatedData,
  deleteProductAndRelatedData,
};
