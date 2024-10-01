import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"; // JWT 토큰 생성을 위한 라이브러리
import bcrypt from "bcryptjs";
import errorHandler from "../middlewares/errorHandler.js"; // 에러 핸들러 미들웨어 import

const prisma = new PrismaClient();
const router = express.Router();

// 회원가입 API
router.route("/signUp").post(async (req, res, next) => {
  const { email, nickname, password } = req.body;

  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        encryptedPassword: hashedPassword,
      },
    });

    res.status(201).json({ message: "회원가입 성공", userId: user.id });
  } catch (error) {
    console.error(error);
    next(error); // 에러를 에러 핸들러로 전달
  }
});

// 로그인 API
router.route("/login").post(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 사용자 조회
    const user = await prisma.user.findUnique({ where: { email } });

    // 사용자 존재 여부 및 비밀번호 확인
    if (!user || !(await bcrypt.compare(password, user.encryptedPassword))) {
      return res
        .status(401)
        .json({ error: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    // JWT 토큰 발급, 토큰 유효기간 1시간으로 설정
    const token = jwt.sign(
      { userId: user.id, nickname: user.nickname },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // 리프레시 토큰 생성
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // 7일 동안 유효
    );

    // 리프레시 토큰을 데이터베이스에 저장
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });

    // 응답 성공, JWT 토큰과 리프레시 토큰을 반환
    res.status(200).json({ message: "로그인 성공", token, refreshToken });
  } catch (error) {
    console.error(error);
    next(error); // 에러를 에러 핸들러로 전달
  }
});

// 리프레시 토큰으로 새로운 액세스 토큰 발급
router.post("/refresh", async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "리프레시 토큰이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // 리프레시 토큰 검증
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      return res
        .status(403)
        .json({ error: "유효하지 않은 리프레시 토큰입니다." });
    }

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: "리프레시 토큰이 유효하지 않습니다." });
  }
});

// 리프레시 토큰 삭제 (로그아웃 시 등)
router.delete("/logout", async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
    res.status(200).json({ message: "로그아웃 성공" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 에러 핸들러 미들웨어 등록
router.use(errorHandler);

export default router;
