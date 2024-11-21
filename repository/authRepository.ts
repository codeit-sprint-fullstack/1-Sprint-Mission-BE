import { PrismaClient, User } from "@prisma/client";
import {
  CreateUserParams,
  FindUserEmailParams,
  FindUserIdParams,
} from "../dto/auth.dto.js";

const prisma = new PrismaClient();

export const findUserEmailRepository = async ({
  email,
}: FindUserEmailParams) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const createUserRepository = async ({
  email,
  encryptedPassword,
  nickname,
}: CreateUserParams) => {
  return await prisma.user.create({
    data: {
      email,
      encryptedPassword,
      nickname,
    },
  });
};

export const findUserIdRepository = async ({ id }: FindUserIdParams) => {
  return await prisma.user.findUnique({ where: { id } });
};
