import prisma from "../utils/prisma.js";

const commentModel = {
  create: async (data) => {
    return prisma.comment.create({ data });
  },

  findMany: async (where, skip, take, orderBy, include) => {
    return prisma.comment.findMany({
      where,
      skip,
      take,
      orderBy,
      include,
    });
  },

  count: async (where) => {
    return prisma.comment.count({ where });
  },

  update: async (id, data) => {
    return prisma.comment.update({
      where: { id: Number(id) },
      data,
    });
  },

  delete: async (id) => {
    return prisma.comment.delete({ where: { id: Number(id) } });
  },
};

export default commentModel;
