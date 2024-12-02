import { signup, login } from './authController';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('signup', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let prisma: PrismaClient;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        nickname: 'testuser',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    prisma = new PrismaClient();

    // Mocking the Prisma client methods explicitly
    (prisma.user.findUnique as jest.Mock).mockClear();
    (prisma.user.create as jest.Mock).mockClear();
    (prisma.user.update as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user and return a success response', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // No existing user
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      nickName: 'testuser',
      encryptedPassword: 'hashedPassword',
    });
    (jwt.sign as jest.Mock)
      .mockReturnValueOnce('accessToken')
      .mockReturnValueOnce('refreshToken');

    await signup(req as Request, res as Response, next);

    expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        nickName: 'testuser',
        encryptedPassword: 'hashedPassword',
      },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { refreshToken: 'refreshToken' },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: '회원가입 성공',
      user: { id: 1, email: 'test@example.com', nickName: 'testuser' },
      accessToken: 'accessToken',
    });
  });

  it('should return an error response if the email already exists', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    }); // Existing user

    await signup(req as Request, res as Response, next);

    expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: '이미 존재하는 이메일입니다.',
    });
  });

  it('should call next with an error if an unexpected error occurs', async () => {
    const error = new Error('Unexpected error');
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(error);

    try {
      await signup(req as Request, res as Response, next);
    } catch (e) {
      // Catch the error to prevent unhandled rejection warnings
    }

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Unexpected error' })
    );
  });
});

describe('login', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let prisma: PrismaClient;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    prisma = new PrismaClient();

    (prisma.user.findUnique as jest.Mock).mockClear();
    (prisma.user.update as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log in a user and return a success response', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      nickName: 'testuser',
      encryptedPassword: 'hashedPassword',
      refreshToken: 'existingRefreshToken',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Simulate an expired or invalid refresh token by making jwt.verify throw an error
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Refresh token is invalid or expired');
    });

    // Set up jwt.sign for access token and refresh token
    // First call returns the accessToken, second call returns the refreshToken
    (jwt.sign as jest.Mock).mockImplementation((payload, secret, options) => {
      if (options?.expiresIn === '15m') {
        // Access Token
        return 'newAccessToken';
      } else if (options?.expiresIn === '7d') {
        // Refresh Token
        return 'newRefreshToken';
      }
      return '';
    });

    await login(req as Request, res as Response, next);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'password123',
      'hashedPassword'
    );
    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { refreshToken: 'newRefreshToken' },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: '로그인 성공',
      user: { id: 1, email: 'test@example.com', nickName: 'testuser' },
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    });
  });

  it('should return an error if the user does not exist', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await login(req as Request, res as Response, next);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: '존재하지 않는 사용자입니다.',
    });
  });

  it('should return an error if the password is incorrect', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      nickName: 'testuser',
      encryptedPassword: 'hashedPassword',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await login(req as Request, res as Response, next);

    expect(bcrypt.compare).toHaveBeenCalledWith(
      'password123',
      'hashedPassword'
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: '비밀번호가 일치하지 않습니다.',
    });
  });

  it('should call next with an error if an unexpected error occurs', async () => {
    const error = new Error('Unexpected error');
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(error);

    await login(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
