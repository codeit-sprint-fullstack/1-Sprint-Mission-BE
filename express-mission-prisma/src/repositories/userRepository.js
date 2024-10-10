import prisma from "../config/prisma.js";

async function getById(id) {
  return await prisma.user.findUniqueOrThrow({
    where: { id },
  });
}

export default {
    getById
}