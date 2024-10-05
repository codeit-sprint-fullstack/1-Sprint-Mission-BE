import prisma from "../utils/prisma.js";

const articleModel = {
  create: async (data) => {
    return prisma.article.create({ data });
  },

  findMany: async (skip, take, orderBy) => {
    return prisma.article.findMany({
      skip,
      take,
      orderBy,
      include: { writer: { select: { id: true, nickname: true } } },
    });
  },

  count: async () => {
    return prisma.article.count();
  },
};

export default articleModel;
