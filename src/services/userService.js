import { prisma } from "../utils/prisma.js";
import bcrypt from "bcrypt";

export const getUserProfile = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, nickname: true, image: true },
  });
};

export const updateUserProfile = async (userId, userData) => {
  return prisma.user.update({
    where: { id: userId },
    data: userData,
  });
};

export const changeUserPassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.encryptedPassword
  );
  if (!isPasswordValid) throw new Error("Current password is incorrect");

  const encryptedPassword = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id: userId },
    data: { encryptedPassword },
  });
};
