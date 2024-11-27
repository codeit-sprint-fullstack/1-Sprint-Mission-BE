import { Prisma, User } from "@prisma/client";

import userRepository from "../repositories/user-repository";
import { ModifyUserParam } from "../types/user-types";
import { userBaseSelect } from "./selectors/user-select";
import { hashPassword } from "../utils/password";

async function getUser(userId: string): Promise<Partial<User>> {
  const where = { id: userId };

  return await userRepository.findUniqueOrThrowData({
    where,
    select: userBaseSelect,
  });
}

async function modifyUser({
  userId,
  nickname,
  image,
  password,
}: ModifyUserParam): Promise<Partial<User>> {
  const where = { id: userId };
  const data: Prisma.UserUpdateInput = {
    ...(nickname && { nickname }),
    ...(image && { image }),
  };

  if (password) {
    const encryptedPassword: string = await hashPassword(password);
    data.encryptedPassword = encryptedPassword;
  }

  return await userRepository.updateData({
    where,
    data,
    select: userBaseSelect,
  });
}

export default {
  getUser,
  modifyUser,
};
