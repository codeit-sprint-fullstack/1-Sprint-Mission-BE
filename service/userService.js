import prisma from "../models/index.js";

export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};
