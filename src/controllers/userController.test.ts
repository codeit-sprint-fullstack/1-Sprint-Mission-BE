import { getUser } from './userController';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user: {
    userId: number;
  };
}

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('User Controller', () => {
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user information successfully', async () => {
      (req as any).user = { userId: 1 };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        nickName: 'testuser',
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-02T00:00:00.000Z'),
      });

      await getUser(req as CustomRequest, res as Response, next);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          nickName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '사용자 정보 조회 성공',
        user: expect.objectContaining({
          id: 1,
          email: 'test@example.com',
          nickName: 'testuser',
        }),
      });
    });

    it('should return 404 if user is not found', async () => {
      (req as any).user = { userId: 1 };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await getUser(req as CustomRequest, res as Response, next);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          nickName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: '사용자를 찾을 수 없습니다.',
      });
    });

    it('should return 500 if an error occurs', async () => {
      (req as any).user = { userId: 1 };

      const error = new Error('Database error');
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(error);

      await getUser(req as CustomRequest, res as Response, next);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          nickName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: '사용자 정보를 조회할 수 없습니다.',
      });
    });
  });
});
