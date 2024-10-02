import { assert } from "superstruct";
import prisma from "../config/prisma.js";
import { createArticle } from "../structs/articleStruct.js";

async function getAllByFilter(fillter) {
  const { orderBy, skip, take, where } = fillter;
  return await prisma.article.findMany({
    orderBy,
    skip,
    take,
    where,
  });
}

async function countByFilter(fillter) {
  return await prisma.article.count({
    where: fillter,
  });
}

async function create(article) {
  assert(article, createArticle);
  return await prisma.article.create({
    data: {
      title: article.title,
      content: article.content,
    },
  });
}

export default {
  getAllByFilter,
  countByFilter,
  create,
};
