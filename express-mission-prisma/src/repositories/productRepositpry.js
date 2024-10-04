import prisma from "../config/prisma";

async function create(createData) {
  return await prisma.product.create({
    data: createData,
  });
}

export default {
  create,
};
