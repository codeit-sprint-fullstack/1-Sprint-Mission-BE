import prisma from "../config/prisma.js";

async function create(createData) {
  return await prisma.product.create({
    data: createData,
  });
}

export default {
  create,
};
