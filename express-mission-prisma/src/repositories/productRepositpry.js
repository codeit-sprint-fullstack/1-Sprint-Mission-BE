import prisma from "../config/prisma.js";

async function create(createData) {
  return await prisma.product.create({
    data: createData,
  });
}

async function getById(id) {
  return await prisma.product.findUniqueOrThrow({
    where: { id },
  });
}

async function getAllByfilter(filter) {
  const { orderBy, skip, take, where } = filter;
  return await prisma.product.findMany({
    orderBy,
    skip,
    take,
    where,
  });
}

async function countByfilter(filter) {
  return await prisma.product.count({
    where: filter,
  });
}

async function update(updateData) {
  const { where, data } = updateData;
  return await prisma.product.update({
    where,
    data,
  });
}

async function deleteById(id) {
  return await prisma.product.delete({
    where: { id },
  });
}

export default {
  create,
  getById,
  getAllByfilter,
  countByfilter,
  update,
  deleteById,
};
