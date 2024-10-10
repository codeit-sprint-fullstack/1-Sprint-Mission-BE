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

export default {
  create,
  getById,
};
