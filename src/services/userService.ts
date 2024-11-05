import prisma from "../models/index.js";
import { User } from "@prisma/client";

export const getUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};
