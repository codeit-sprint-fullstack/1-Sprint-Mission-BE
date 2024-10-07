import prisma from "../config/prisma.js";

async function singUp(singUpData) {
  return await prisma.user.create({
    data: singUpData,
  });
}

async function findByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export default {
  singUp,
  findByEmail,
};
