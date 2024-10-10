import prisma from "../config/prisma.js";

async function create(createData) {
  return await prisma.article.create({
    data: createData,
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

async function update(updateData) {
  const { where, data } = updateData;
  return await prisma.article.update({
    where,
    data,
  });
}

async function deleteById(id) {
  return await prisma.article.delete({
    where: { id },
  });
}

export default {
  create,
  getAllByFilter,
  countByFilter,
  getById,
  update,
  deleteById,
};
