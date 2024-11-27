import { Prisma } from "@prisma/client";

export const userBaseSelect: Prisma.UserSelect = {
  id: true,
  nickname: true,
  name: true,
  email: true,
  createdAt: true,
};

export const userIdentificationSelect: Prisma.UserSelect = {
  ...userBaseSelect,
  encryptedPassword: true,
};
