import { PrismaClient } from '@prisma/client';
import { userRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const userService = {
  createUser: async (user) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      const error = new Error('User already exists');
      error.code = 422;
      throw error;
    }
    const hashedPassword = await hashingPassword(user.encryptedPassword); // 해싱 과정 추가

    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        nickname: user.nickname,
        encryptedPassword: hashedPassword,
      },
    });

    return filterSensitiveUserData(createdUser);
  },

  loginUser: async (email, encryptedPassword) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const error = new Error('Unauthorized');
      error.code = 401;
      throw error;
    }

    verifyPassword(encryptedPassword, user.encryptedPassword);

    return filterSensitiveUserData(user);
  },

  updateUser: async (id, data) => {
    return await userRepository.update(id, data);
  },

  refreshToken: async (userId, refreshToken) => {
    const user = await userRepository.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      const error = new Error('Unauthorized');
      error.code = 401;
      throw error;
    }
    const accessToken = createToken(user); // 변경
    const newRefreshToken = createToken(user, 'refresh'); // 추가
    return { accessToken, newRefreshToken }; // 변경
  },

  createToken: (user, type) => {
    const payload = { userId: user.id };
    const options = {
      expiresIn: type === 'refresh' ? '2w' : '1h',
    };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
  },
};

function filterSensitiveUserData(createdUser) {
  const { encryptedPassword, refreshToken, ...rest } = createdUser;
  return rest;
}

async function hashingPassword(password) {
  if (!password) {
    throw new Error('Password is required'); // 비밀번호가 없을 경우 예외 처리
  }
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function verifyPassword(inputPassword, savedPassword) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);

  if (!isValid) {
    const error = new Error('Unauthorized');
    error.code = 401;
    throw error;
  }
}

export default userService;
