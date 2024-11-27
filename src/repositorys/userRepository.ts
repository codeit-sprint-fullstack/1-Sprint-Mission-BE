import prismaClient from "../utils/prismaClient";
import { User } from "@prisma/client";

interface UserData {
  email: string;
  password: string;
  nickname: string;
}

const getUsers = (): Promise<User[]> => {
  return prismaClient.user.findMany();
};

const findByEmail = async (email: string): Promise<User | null> => {
  return prismaClient.user.findUnique({
    where: {
      email,
    },
  });
};

const findById = async (id: string): Promise<User | null> => {
  return prismaClient.user.findUnique({
    where: {
      id,
    },
  });
};

const create = async (data: UserData): Promise<User> => {
  return prismaClient.user.create({
    data,
  });
};

const updateRefreshToken = async (
  id: string,
  refreshToken: string
): Promise<User> => {
  return prismaClient.user.update({
    where: {
      id,
    },
    data: {
      refreshToken,
    },
  });
};

export default {
  create,
  updateRefreshToken,
  getUsers,
  findByEmail,
  findById,
};
