import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import {
  ValidationError,
  UnauthorizedError,
} from "../middlewares/errorMiddleware.js";

export const signUp = async (userData) => {
  const { email, nickname, password } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ValidationError("이미 존재하는 이메일입니다.");
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      nickname,
      encryptedPassword,
    },
  });

  return { id: user.id, email: user.email, nickname: user.nickname };
};

export const signIn = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.encryptedPassword
  );
  if (!isPasswordValid) {
    throw new UnauthorizedError("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { accessToken };
};
