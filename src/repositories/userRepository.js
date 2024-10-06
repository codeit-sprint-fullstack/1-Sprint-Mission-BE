import prisma from "../config/prisma.js";

export async function findById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function findEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function create(user) {
  return prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      password: user.password,
    },
  });
}

export async function createOrUpdateOauth(provider, providerId, email, name) {
  return prisma.user.upsert({
    where: { provider, providerId },
    create: { provider, providerId, email, name },
    update: { email, name },
  });
}
