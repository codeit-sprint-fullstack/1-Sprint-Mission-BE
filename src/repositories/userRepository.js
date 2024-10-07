import { USER_FIELDS } from "../config/fieldOptions.js";
import prisma from "../config/prisma.js";

export async function findById(id) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      ...USER_FIELDS,
    },
  });
}

export async function findByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      ...USER_FIELDS,
      encryptedPassword: true,
    },
  });
}

export async function create({
  email,
  nickname,
  encryptedPassword,
  refreshToken,
}) {
  return await prisma.user.create({
    data: {
      email,
      nickname,
      encryptedPassword,
      refreshToken,
    },
    select: {
      ...USER_FIELDS,
    },
  });
}

export async function update(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
      ...USER_FIELDS,
    },
  });
}

export async function updateRefreshToken(id, refreshToken) {
  return await prisma.user.update({
    where: { id },
    data: {
      refreshToken,
    },
    select: {
      ...USER_FIELDS,
    },
  });
}

export async function createOrUpdateOauth({
  provider,
  providerId,
  email,
  nickname,
}) {
  return await prisma.user.upsert({
    where: { provider, providerId },
    create: { provider, providerId, email, nickname },
    update: { email, nickname },
    select: {
      ...USER_FIELDS,
    },
  });
}
