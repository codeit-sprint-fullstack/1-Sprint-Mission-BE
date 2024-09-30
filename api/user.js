import express from "express";
import { PrismaClient } from "@prisma/client";
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

export default router;
