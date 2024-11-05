import prisma from "../models/index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nickname }],
    },
  });

  if (existingUser) {
    throw new Error("이메일 또는 닉네임이 이미 사용중입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { nickname, email, encryptedPassword: hashedPassword },
  });

  const tokens = await generateAndSaveTokens(newUser);
  return { newUser, tokens };
};

export const getUserByEmail = async (
  email: string,
  password: string
): Promise<{ user: User; tokens: Tokens }> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.encryptedPassword))) {
    throw new Error("이메일과 비밀번호를 다시 확인해주세요");
  }

  const tokens = await generateAndSaveTokens(user);
  return { user, tokens };
};

const generateAndSaveTokens = async (user: User): Promise<Tokens> => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const tokens = await prisma.auth.create({
    data: {
      user: { connect: { id: user.id } },
      accessToken,
      refreshToken,
      accessTokenExp: getExpirationDate(3),
      refreshTokenExp: getExpirationDate(7, "days"),
    },
  });

  return tokens;
};

export const refreshToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
  if (!refreshToken) throw new Error("Refresh token not provided");

  try {
    // 1. Refresh token 검증
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

    // 2. Refresh token의 존재 여부 확인
    const tokenRecord = await prisma.auth.findUnique({
      where: { refreshToken },
    });
    if (!tokenRecord) throw new Error("Invalid refresh token");

    // 3. 사용자 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { id: tokenRecord.userId }, // `userId`는 `auth` 테이블에서 사용자를 식별하는 외래 키라고 가정
    });
    if (!user) throw new Error("User not found");

    // 4. 새로운 Access Token 생성
    const newAccessToken = generateAccessToken(user);

    // 5. 인증 정보 업데이트
    await prisma.auth.update({
      where: { refreshToken },
      data: {
        accessToken: newAccessToken,
        accessTokenExp: getExpirationDate(3), // 만료일 설정 (예: 3시간)
      },
    });

    // 6. 새로 발급된 토큰과 사용자 정보 반환
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
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "3h",
    }
  );
};

const generateRefreshToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

const getExpirationDate = (time: number, unit: string = "hours"): Date => {
  const unitsToMs: { [key: string]: number } = {
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
  };
  return new Date(Date.now() + time * unitsToMs[unit]);
};
