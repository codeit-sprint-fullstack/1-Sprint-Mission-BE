import prisma from "../config/prisma.js";

async function create(createData) {
  return await prisma.like.create({
    data: createData,
  });
}

async function getByFillter(fillter) {
  return await prisma.like.findFirst({
    where: fillter,
  });
}

async function countByFillter(fillter) {
  return await prisma.like.count({
    where: fillter,
  });
}

async function fetchArticleAndRelatedData(transactionData) {
  const { createData, countFillter, userId, articleId } = transactionData;
  return await prisma.$transaction([
    prisma.like.create({ data: createData }),
    prisma.like.count({ where: countFillter }),
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.article.findFirstOrThrow({ where: { id: articleId } }),
  ]);
}

export default {
  create,
  getByFillter,
  countByFillter,
  fetchArticleAndRelatedData,
};
