import prisma from "../config/prisma.js";

export async function findById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function findByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function create({
  email,
  nickname,
  encryptedPassword,
  refreshToken,
}) {
  return prisma.user.create({
    data: {
      email,
      nickname,
      encryptedPassword,
      refreshToken,
    },
  });
}

export async function update(id, data) {
  return prisma.user.update({
    where: { id },
    data: data,
  });
}

export async function createOrUpdateOauth({
  provider,
  providerId,
  email,
  name,
}) {
  return prisma.user.upsert({
    where: { provider, providerId },
    create: { provider, providerId, email, name },
    update: { email, name },
  });
}
