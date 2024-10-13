import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redis from 'redis';

const prisma = new PrismaClient();
const redisClient = redis.createClient();

export const getUsers = async () => {
  const user = await prisma.user.findMany({
    include: {
      Favorite: true,
    },
  });

  return user;
};

export const getUserDetail = async (id) => {
  const user = await prisma.user.findUniqueOrThrow({
    include: {
      fleaMarket: true,
      freeBoard: true,
      Favorite: true,
    },
    where: { id },
  });
  return user;
};

export const editUser = async (id) => {
  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  });

  return user;
};

export const deleteUser = async (id) => {
  await prisma.user.delete({
    where: { id },
  });
};

export const createUser = async (user) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (existingUser) {
    const error = new Error('가입된 이메일이 존재합니다.');
    error.code = 422;
    error.status = 422;
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
};

export const loginUser = async (email, encryptedPassword) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error('가입된 이메일이 없습니다.');
    error.code = 401;
    error.status = 401;
    throw error;
  }

  await verifyPassword(encryptedPassword, user.encryptedPassword);

  return filterSensitiveUserData(user);
};

export const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id: id },
    data,
  });
};

export const refreshToken = async (userId, refreshToken) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error('권한이 없습니다.');
    error.code = 401;
    error.status = 401;
    throw error;
  }

  const newAccessToken = createToken(user);
  const newRefreshToken = createToken(user, 'refresh');

  // redisClient.set(user.id, newRefreshToken, 'EX', 7 * 24 * 60 * 60);

  return { newAccessToken, newRefreshToken };
};

export const createToken = (user, type) => {
  const payload = { userId: user.id };
  const options = {
    expiresIn: type === 'refresh' ? '2w' : '1h',
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const filterSensitiveUserData = (createdUser) => {
  const { encryptedPassword, refreshToken, ...rest } = createdUser;
  return rest;
};

const hashingPassword = async (password) => {
  if (!password) {
    const error = new Error('비밀번호는 필수입니다.');
    error.code = 400;
    error.status = 400;
    throw error;
  }
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (inputPassword, savedPassword) => {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);

  if (!isValid) {
    const error = new Error('비밀번호가 틀렸습니다.');
    error.code = 401;
    error.status = 401;
    throw error;
  }
};

// const oauthCreateOrUpdate = async (provider, providerId, email, name)=> {
//   const user = await userRepository.createOrUpdate(
//     provider,
//     providerId,
//     email,
//     name
//   );
//   return filterSensitiveUserData(user);
// }
