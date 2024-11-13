import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  createUserRepository,
  findUserEmailRepository,
} from '../repository/authRepository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mini1018';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'mini1018';

export const signupService = async ({ email, password, nickname }) => {
  const existingUser = await findUserEmailRepository({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await createUserRepository({
    email,
    encryptedPassword: hashedPassword,
    nickname,
  });
};

export const loginService = async ({ email, password }) => {
  const user = await findUserEmailRepository({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.encryptedPassword
  );

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken, user };
};
