import jwt from 'jsonwebtoken';
import {
  createUserRepository,
  findUserEmailRepository,
} from '../repository/authRepository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const signupService = async ({ email, encryptedPassword, nickname }) => {
  const existingUser = await createUserRepository(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  return await createUserRepository({
    email,
    encryptedPassword,
    nickname,
  });
};

export const loginService = async ({ email, password }) => {
  const user = await findUserEmailRepository(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  return token;
};
