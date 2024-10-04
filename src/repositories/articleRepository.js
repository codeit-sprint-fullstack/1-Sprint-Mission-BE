import prisma from "../config/prisma.js";

async function getAll({ searchQuery, sortOption, offset, pageSize }) {
  const articles = await prisma.article.findMany({
    where: searchQuery,
    orderBy: sortOption,
    skip: offset,
    take: pageSize,
  });

  return articles;
}

async function getTotalCount(searchQuery) {
  const totalCount = await prisma.article.count({ where: searchQuery });
  return totalCount;
}

async function getById(id) {
  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
  });

  return article;
}

async function create(data) {
  const newArticle = await prisma.article.create({
    data,
  });
  return newArticle;
}

// patch existed article with id
async function updateById(id, data) {
  const updatedArticle = await prisma.article.update({
    where: { id },
    data,
  });
  return updatedArticle;
}

// delete an article by id
async function deleteById(id) {
  const deletedArticle = await prisma.article.delete({ where: { id } });
  return deletedArticle;
}

export default {
  getAll,
  getTotalCount,
  create,
  getById,
  updateById,
  deleteById,
};
