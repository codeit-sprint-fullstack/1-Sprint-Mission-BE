import prisma from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (nickname, email, password) => {
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

export const getUserByEmail = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.encryptedPassword))) {
    throw new Error("이메일과 비밀번호를 다시 확인해주세요");
  }

  const tokens = await generateAndSaveTokens(user);
  return { user, tokens };
};

const generateAndSaveTokens = async (user) => {
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

export const refreshToken = async (refreshToken) => {
  if (!refreshToken) throw new Error("Refresh token not provided");

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const tokenRecord = await prisma.auth.findUnique({
      where: { refreshToken },
    });
    if (!tokenRecord) throw new Error("Invalid refresh token");

    const newAccessToken = generateAccessToken(decoded);

    await prisma.auth.update({
      where: { refreshToken },
      data: {
        accessToken: newAccessToken,
        accessTokenExp: getExpirationDate(3),
      },
    });

    return { accessToken: newAccessToken };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Invalid or expired refresh token");
  }
};

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "3h",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const getExpirationDate = (time, unit = "hours") => {
  const unitsToMs = {
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
  };
  return new Date(Date.now() + time * unitsToMs[unit]);
};
