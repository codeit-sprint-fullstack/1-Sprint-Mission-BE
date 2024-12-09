import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../env";
import authRepository from "../repositorys/authRepository";

interface User {
  id: number;
  nickname: string;
  email: string;
  encryptedPassword: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExp: Date;
  refreshTokenExp: Date;
}

export const createUser = async (
  nickname: string,
  email: string,
  password: string
): Promise<{ newUser: User; tokens: Tokens }> => {
  const existingUser = await authRepository.findUserByEmailOrNickname(
    email,
    nickname
  );

  if (existingUser) {
    throw new Error("이메일 또는 닉네임이 이미 사용중입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await authRepository.createUser(
    nickname,
    email,
    hashedPassword
  );
  const tokens = await generateAndSaveTokens(newUser);

  return { newUser, tokens };
};

export const getUserByEmail = async (
  email: string,
  password: string
): Promise<{ user: User; tokens: Tokens }> => {
  const user = await authRepository.findUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.encryptedPassword))) {
    throw new Error("이메일과 비밀번호를 다시 확인해주세요");
  }

  const tokens = await generateAndSaveTokens(user);
  return { user, tokens };
};

const generateAndSaveTokens = async (user: User): Promise<Tokens> => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return authRepository.createAuth(
    user.id,
    accessToken,
    refreshToken,
    getExpirationDate(3),
    getExpirationDate(7, "days")
  );
};

export const refreshToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
  if (!refreshToken) throw new Error("Refresh token not provided");

  try {
    jwt.verify(refreshToken, env.RefreshTokenSecret!);

    const tokenRecord = await authRepository.findAuthByRefreshToken(
      refreshToken
    );
    if (!tokenRecord) throw new Error("Invalid refresh token");

    const user = await authRepository.findUserById(tokenRecord.userId);
    if (!user) throw new Error("User not found");

    const newAccessToken = generateAccessToken(user);

    await authRepository.updateAuth(
      refreshToken,
      newAccessToken,
      getExpirationDate(3)
    );

    return {
      accessToken: newAccessToken,
      refreshToken: refreshToken,
      user,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Invalid or expired refresh token");
  }
};

const generateAccessToken = (user: User): string => {
  return jwt.sign({ id: user.id, email: user.email }, env.AccessTokenSecret!, {
    expiresIn: "3h",
  });
};

const generateRefreshToken = (user: User): string => {
  return jwt.sign({ id: user.id, email: user.email }, env.RefreshTokenSecret!, {
    expiresIn: "7d",
  });
};

const getExpirationDate = (time: number, unit: string = "hours"): Date => {
  const unitsToMs: { [key: string]: number } = {
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
  };
  return new Date(Date.now() + time * unitsToMs[unit]);
};
