import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findUserEmailRepository = async ({ email }) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const createUserRepository = async ({
  email,
  encryptedPassword,
  nickname,
}) => {
  return await prisma.user.create({
    data: {
      email,
      encryptedPassword,
      nickname,
    },
  });
};

export const findUserIdRepository = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
};
