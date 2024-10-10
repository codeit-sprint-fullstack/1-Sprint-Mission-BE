import prisma from "../config/prisma.js";

async function getByFillter(fillter) {
  return await prisma.like.findFirst({
    where: fillter,
  });
}

async function create(createData) {
  return await prisma.like.create({
    data: createData,
  });
}

export default {
  create,
  getByFillter,
};
