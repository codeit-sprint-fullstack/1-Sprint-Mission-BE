import prisma from "./prisma.js";
import { userSelect } from "../responses/user-res.js";

async function createUser(userData) {
  return await prisma.user.create({ data: userData, select: userSelect });
}

async function getUserDataByUserId(userId) {
  return await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      ...userSelect,
      encryptedPassword: true,
    },
  });
}

async function getUserDataByEmail(email) {
  return await prisma.user.findUniqueOrThrow({
    where: { email },
    select: {
      ...userSelect,
      encryptedPassword: true,
    },
  });
}

export default { createUser, getUserDataByUserId, getUserDataByEmail };
