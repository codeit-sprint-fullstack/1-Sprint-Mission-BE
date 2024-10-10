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

async function countByFilter(fillter) {
  return await prisma.like.count({
    where: fillter,
  });
}

export default {
  create,
  getByFillter,
  countByFilter,
};
