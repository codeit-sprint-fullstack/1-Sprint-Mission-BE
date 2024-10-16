import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
export async function signup(req, res, next) {
  try {
    const { email, nickname, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        nickName: nickname,
        encryptedPassword,
      },
    });

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.status(201).json({
      message: "회원가입 성공",
      user: { id: user.id, email: user.email, nickName: user.nickName },
      accessToken,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "존재하지 않는 사용자입니다." });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.encryptedPassword
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    let refreshToken = user.refreshToken;

    if (refreshToken) {
      try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      } catch (err) {
        console.log("Refresh token is invalid or expired. Creating a new one.");
        refreshToken = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken },
        });
      }
    } else {
      refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      message: "로그인 성공",
      user: { id: user.id, email: user.email, nickName: user.nickName },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    next(error);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "인증 토큰이 없습니다." });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res
        .status(403)
        .json({ message: "유효하지 않은 또는 만료된 토큰입니다." });
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "해당 사용자 정보가 없습니다." });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const newRefreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.status(200).json({
      message: "토큰 갱신 성공",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("인증 토큰 오류:", error);
    next(error);
  }
}

export default {
  signup,
  login,
  refreshToken,
};
