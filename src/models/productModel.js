import { prisma } from "../utils/prisma.js";

const productModel = {
  create: async (data) => {
    return prisma.product.create({ data });
  },

  findMany: async (skip, take, orderBy) => {
    return prisma.product.findMany({
      skip,
      take,
      orderBy,
    });
  },

  count: async () => {
    return prisma.product.count();
  },

  findUnique: async (id, include) => {
    return prisma.product.findUnique({
      where: { id: Number(id) },
      include,
    });
  },

  update: async (id, data) => {
    return prisma.product.update({
      where: { id: Number(id) },
      data,
    });
  },

  delete: async (id) => {
    return prisma.product.delete({ where: { id: Number(id) } });
  },
};

export default productModel;
