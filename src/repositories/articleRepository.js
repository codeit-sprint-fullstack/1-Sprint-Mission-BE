import prisma from "../config/prisma.js";
import { ARTICLE_FIELDS, OWNER_FIELDS } from "../config/fieldOptions.js";

export async function getAll({ searchQuery, sortOption, offset, pageSize }) {
  const articles = await prisma.article.findMany({
    where: searchQuery,
    orderBy: sortOption,
    skip: offset,
    take: pageSize,
    select: {
      ...ARTICLE_FIELDS,
    },
  });

  return articles;
}

export async function getTotalCount(searchQuery) {
  const totalCount = await prisma.article.count({ where: searchQuery });
  return totalCount;
}

export async function getById(id) {
  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
    select: {
      ...ARTICLE_FIELDS,
    },
    writer: {
      select: {
        ...OWNER_FIELDS,
      },
    },
  });

  return article;
}

export async function create(data) {
  const newArticle = await prisma.article.create({
    data: {
      ...data,
    },
    select: {
      ...ARTICLE_FIELDS,
    },
    writer: {
      select: {
        ...OWNER_FIELDS,
      },
    },
  });
  return newArticle;
}

export async function updateById(id, data) {
  const updatedArticle = await prisma.article.update({
    where: { id },
    data: {
      ...data,
    },
    select: {
      ...ARTICLE_FIELDS,
    },
    writer: {
      select: {
        ...OWNER_FIELDS,
      },
    },
  });
  return updatedArticle;
}

export async function deleteById(id) {
  await prisma.article.delete({ where: { id } });
}
