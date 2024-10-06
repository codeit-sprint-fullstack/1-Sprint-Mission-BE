import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userRepository = {
  save: async (userData) => {
    return await prisma.user.create({
      data: userData,
    });
  },

  update: async (id, data) => {
    return await prisma.user.update({
      where: { id: id },
      data,
    });
  },
};
