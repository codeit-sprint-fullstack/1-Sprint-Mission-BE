import prisma from '../config/prisma.js'

async function getAllByFilter(fillter) {
  const { orderBy, skip, take, where } = fillter;
  const articles = await prisma.article.findMany({
    orderBy,
    skip,
    take,
    where,
  });
  return articles;
}

async function countByFilter(fillter) {
  const count = await prisma.article.count({
    where: fillter,
  });
  return count;
}

async function save() {}

export default {
  getAllByFilter,
  countByFilter,
};
