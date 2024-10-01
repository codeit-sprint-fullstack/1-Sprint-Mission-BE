import prismaClient from "../utils/prismaClient.js";

const getUsers = () => {
  return prismaClient.user.findMany();
};

const findByEmail = async (email) => {
  return prismaClient.user.findUnique({
    where: {
      email,
    },
  });
};

const findById = async (id) => {
  return prismaClient.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
};

const create = async (data) => {
  return prismaClient.user.create({
    data,
  });
};

const update = async (id, data) => {
  return prismaClient.user.update({
    where: {
      id,
    },
    data,
  });
};

export default {
  create,
  update,
  getUsers,
  findByEmail,
  findById,
};
