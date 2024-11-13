import prisma from "../config/prisma.js";

async function singUp(singUpData) {
  return await prisma.user.create({
    data: singUpData,
  });
}

async function findByEmail(email) {
  return await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });
}

async function update(updateData) {
  const { where, data } = updateData;
  return await prisma.user.update({
    where,
    data,
  });
}

async function getById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export default {
  singUp,
  findByEmail,
  update,
  getById,
};
