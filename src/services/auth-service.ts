import prisma from "../repositories/prisma";
import { User } from "@prisma/client";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { hashPassword, verifyPassword } from "../utils/password";
import userRepository from "../repositories/user-repository";
import {
  createAccessToken,
  createRefreshToken,
  extractUserIdFromRefreshToken,
} from "../utils/token";
import { userIndetificationInfoMapper } from "./mappers/user-mapper";

import {
  UserSignUpData,
  UserSignInData,
  UserTokenInfo,
} from "../types/user-types";
import {
  userBaseSelect,
  userIdentificationSelect,
} from "./selectors/user-select";
import { CustomError } from "../utils/error";

async function signUp({
  email,
  password,
  nickname,
  name,
}: UserSignUpData): Promise<User> {
  const encryptedPassword: string = await hashPassword(password);

  return prisma.$transaction(async () => {
    const userData = { email, encryptedPassword, nickname, name };
    const createUser = userRepository.createData({
      data: userData,
      select: userBaseSelect,
    });

    return createUser;
  });
}

async function signIn({
  email,
  password,
}: UserSignInData): Promise<UserTokenInfo | null | boolean> {
  return prisma.$transaction(async () => {
    const userWhere = { email: email };
    const findUserData = await userRepository.findUniqueData({
      where: userWhere,
      select: userIdentificationSelect,
    });

    if (!findUserData) {
      return null;
    }

    const isMatch = await verifyPassword({
      hashedPassword: findUserData.encryptedPassword,
      plainPassword: password,
    });

    if (!isMatch) {
      return false;
    }

    const accessToken = createAccessToken(findUserData.id);
    const refreshToken = createRefreshToken(findUserData.id);

    return userIndetificationInfoMapper({
      userInfo: findUserData,
      accessToken,
      refreshToken,
    });
  });
}

async function refreshAccessToken(
  RefreshToken: string
): Promise<string | Error> {
  const userId: string | JsonWebTokenError | TokenExpiredError | CustomError =
    extractUserIdFromRefreshToken(RefreshToken);

  if (typeof userId === "string") {
    return createAccessToken(userId);
  }

  return userId;
}

export default { signUp, signIn, refreshAccessToken };
