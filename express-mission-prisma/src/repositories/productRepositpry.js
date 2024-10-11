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

async function getAllByFillter(fillter) {
  const { orderBy, skip, take, where } = fillter;
  return await prisma.product.findMany({
    orderBy,
    skip,
    take,
    where,
  });
}

async function countByFillter(fillter) {
  return await prisma.product.count({
    where: fillter,
  });
}

export default {
  create,
  getById,
  getAllByFillter,
  countByFillter,
};
