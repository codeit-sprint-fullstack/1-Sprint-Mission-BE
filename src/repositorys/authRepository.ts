import prisma from "../models/index";
import { User, Auth } from "@prisma/client";

export class AuthRepository {
  async findUserByEmailOrNickname(
    email: string,
    nickname: string
  ): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }],
      },
    });
  }

  async createUser(
    nickname: string,
    email: string,
    encryptedPassword: string
  ): Promise<User> {
    return prisma.user.create({
      data: { nickname, email, encryptedPassword },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(userId: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async createAuth(
    userId: number,
    accessToken: string,
    refreshToken: string,
    accessTokenExp: Date,
    refreshTokenExp: Date
  ): Promise<Auth> {
    return prisma.auth.create({
      data: {
        user: { connect: { id: userId } },
        accessToken,
        refreshToken,
        accessTokenExp,
        refreshTokenExp,
      },
    });
  }

  async findAuthByRefreshToken(refreshToken: string): Promise<Auth | null> {
    return prisma.auth.findUnique({
      where: { refreshToken },
    });
  }

  async updateAuth(
    refreshToken: string,
    accessToken: string,
    accessTokenExp: Date
  ): Promise<Auth> {
    return prisma.auth.update({
      where: { refreshToken },
      data: {
        accessToken,
        accessTokenExp,
      },
    });
  }
}

export default new AuthRepository();
