import prisma from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 유저 생성 및 토큰 생성
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
    data: {
      nickname,
      email,
      encryptedPassword: hashedPassword,
    },
  });

  const tokens = await generateAndSaveTokens(newUser);

  return { newUser, tokens };
};

export const getUserByEmail = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 유저 확인 및 비밀번호 검증
  if (!user || !(await bcrypt.compare(password, user.encryptedPassword))) {
    throw new Error("이메일과 비밀번호를 다시 확인해주세요");
  }

  // 토큰 생성 및 저장
  const tokens = await generateAndSaveTokens(user);

  return { user, tokens };
};

const generateAndSaveTokens = async (user) => {
  // 엑세스 토큰 생성 (3시간 만료)
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "3h" } // 엑세스 토큰 만료 시간 3시간
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // 리프레시 토큰 만료 시간 7일
  );

  const tokens = await prisma.auth.create({
    data: {
      user: { connect: { id: user.id } },
      accessToken,
      refreshToken,
      accessTokenExp: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3시간 후 만료
      refreshTokenExp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후 만료
    },
  });

  return tokens;
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token not provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const tokenRecord = await prisma.auth.findUnique({
      where: { refreshToken },
    });

    if (!tokenRecord) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3h" }
    );

    await prisma.auth.update({
      where: { refreshToken },
      data: {
        accessToken: newAccessToken,
        accessTokenExp: new Date(Date.now() + 3 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};
