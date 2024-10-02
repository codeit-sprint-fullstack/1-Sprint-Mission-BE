import { assert } from "superstruct";
import prisma from "../config/prisma.js";
import { createArticle } from "../structs/articleStruct.js";

async function create(createData) {
  assert(createData, createArticle);
  return await prisma.article.create({
    data: {
      title: createData.title,
      content: createData.content,
    },
  });
}

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

async function getById(id) {
  return await prisma.article.findUniqueOrThrow({
    where: { id },
  });
}

export default {
  create,
  getAllByFilter,
  countByFilter,
  getById,
};
