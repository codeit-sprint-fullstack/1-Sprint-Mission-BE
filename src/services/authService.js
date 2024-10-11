// authService.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';
import {
  ValidationError,
  UnauthorizedError,
} from '../middlewares/errorMiddleware.js';
import { User } from '../models/User.js';

export const signUp = async (userData) => {
  const { email, nickname, password } = userData;

  // 이메일 중복 검사
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ValidationError('이미 존재하는 이메일입니다.');
  }

  // 닉네임 중복 검사 추가
  const existingNickname = await prisma.user.findUnique({
    where: { nickname },
  });
  if (existingNickname) {
    throw new ValidationError('이미 존재하는 닉네임입니다.');
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
    throw new UnauthorizedError('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.encryptedPassword
  );
  if (!isPasswordValid) {
    throw new UnauthorizedError('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // 리프레시 토큰을 데이터베이스에 저장
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
};
