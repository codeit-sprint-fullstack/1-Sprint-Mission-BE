import {
  getComments,
  postComment,
  deleteComment,
  patchComment,
} from './commentController';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customReq';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    comment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Comment Controller', () => {
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

  describe('getComments', () => {
    it('should return comments successfully', async () => {
      req.params = { productId: '1' };
      req.query = { page: '1', pageSize: '10' };

      (prisma.comment.findMany as jest.Mock).mockResolvedValue([
        { id: 1, content: 'Test Comment', userId: 1 },
      ]);

      await getComments(req as Request, res as Response, next);

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: { productId: 1 },
        skip: 0,
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              nickName: true,
              image: true,
            },
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '댓글 목록 추출',
        comments: expect.any(Array),
      });
    });
  });

  describe('postComment', () => {
    it('should create a new comment and return success response', async () => {
      req.params = { productId: '1' };
      req.body = { content: 'This is a test comment' };
      (req as any).user = { userId: 1 };

      (prisma.comment.create as jest.Mock).mockResolvedValue({
        id: 1,
        content: 'This is a test comment',
        userId: 1,
        productId: 1,
      });

      await postComment(req as CustomRequest, res as Response, next);

      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'This is a test comment',
          userId: 1,
          productId: 1,
          articleId: null,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: '댓글 추가 성공',
        comment: expect.objectContaining({ id: 1 }),
      });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment successfully', async () => {
      req.params = { commentId: '1' };
      (req as any).user = { userId: 1 };

      (prisma.comment.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
      });

      (prisma.comment.delete as jest.Mock).mockResolvedValue({
        id: 1,
        content: 'Deleted Comment',
      });

      await deleteComment(req as CustomRequest, res as Response, next);

      expect(prisma.comment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          userId: true,
        },
      });
      expect(prisma.comment.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '댓글 삭제 성공',
        deletedComment: expect.objectContaining({ id: 1 }),
      });
    });
  });

  describe('patchComment', () => {
    it('should update a comment successfully', async () => {
      req.params = { commentId: '1' };
      req.body = { content: 'Updated Comment' };
      (req as any).user = { userId: 1 };

      (prisma.comment.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
      });

      (prisma.comment.update as jest.Mock).mockResolvedValue({
        id: 1,
        content: 'Updated Comment',
      });

      await patchComment(req as CustomRequest, res as Response, next);

      expect(prisma.comment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          userId: true,
        },
      });
      expect(prisma.comment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { content: 'Updated Comment' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '댓글 변경 성공',
        updatedComment: expect.objectContaining({ id: 1 }),
      });
    });
  });
});
