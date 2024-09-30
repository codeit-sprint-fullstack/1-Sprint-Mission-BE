import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"; // JWT 토큰 생성을 위한 라이브러리
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const router = express.Router();

// 회원가입 API
router.post("/signUp", async (req, res) => {
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
    res.status(400).json({ error: "회원가입 실패" });
  }
});

// 로그인 API
router.post("/login", async (req, res) => {
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

    // JWT 토큰 발급, 토큰 유효기간 1시간으로 설정(임시)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 응답 성공사, JWT 토큰을 생성하여 반환
    res.status(200).json({ message: "로그인 성공", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "로그인 실패" });
  }
});

export default router;
