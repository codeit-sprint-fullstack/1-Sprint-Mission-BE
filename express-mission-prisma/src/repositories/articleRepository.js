import prisma from "../config/prisma.js";

async function create(createData) {
  return await prisma.article.create({
    data: createData,
  });
}

async function getAllByfilter(filter) {
  const { orderBy, skip, take, where } = filter;
  return await prisma.article.findMany({
    orderBy,
    skip,
    take,
    where,
  });
}

async function countByfilter(filter) {
  return await prisma.article.count({
    where: filter,
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
  getAllByfilter,
  countByfilter,
  getById,
  update,
  deleteById,
};
