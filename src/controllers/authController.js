import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prismaClient } from "../prismaClient.js";
export async function signup(req, res, next) {
  try {
    const { email, nickname, encryptedPassword } = req.body;

    const existingUser = await prisma.User.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(encryptedPassword, 10);

    const User = await prisma.User.create({
      data: {
        email,
        nickName: nickname,
        encryptedPassword: hashedPassword,
      },
    });

    res.status(201).json({ message: "회원가입 성공", user });
  } catch (error) {
    next(error);
  }
}

export function login(req, res, next) {
  const { email, password } = req.body;

  res.status(200).json({ message: "로그인 성공" });
}

export default {
  signup,
  login,
};
