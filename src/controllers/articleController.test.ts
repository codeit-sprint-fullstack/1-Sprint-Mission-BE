import {
  postArticle,
  getArticles,
  getArticleId,
  patchArticle,
  deleteArticle,
  postArticleFavorite,
} from './articleController';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    article: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    favorite: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Article Controller', () => {
  let req: Partial<Request>;
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

  describe('postArticle', () => {
    it('should create a new article and return success response', async () => {
      req.body = {
        name: 'Test Article',
        content: 'This is a test content',
        images: [],
      };
      (req as any).user = { userId: 1 };

      (prisma.article.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Test Article',
        content: 'This is a test content',
        images: [],
        userId: 1,
      });

      await postArticle(req as Request, res as Response, next);

      expect(prisma.article.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Article',
          content: 'This is a test content',
          images: [],
          userId: 1,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '게시물 추가 성공',
        article: expect.objectContaining({
          id: 1,
          name: 'Test Article',
          content: 'This is a test content',
        }),
      });
    });

    it('should return unauthorized if user is not authenticated', async () => {
      req.body = {
        name: 'Test Article',
        content: 'This is a test content',
      };
      (req as any).user = undefined;

      await postArticle(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
  });

  describe('getArticles', () => {
    it('should return articles successfully', async () => {
      req.query = {
        page: '1',
        pageSize: '10',
      };

      (prisma.article.findMany as jest.Mock).mockResolvedValue([
        {
          id: 1,
          name: 'Article 1',
          content: 'Content 1',
          createdAt: new Date(),
        },
      ]);

      await getArticles(req as Request, res as Response, next);

      expect(prisma.article.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '게시물 정보 추출',
        articles: expect.any(Array),
      });
    });
  });

  describe('getArticleId', () => {
    it('should return a specific article', async () => {
      req.params = { articleId: '1' };

      (prisma.article.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Article 1',
        content: 'Content 1',
        comment: [],
      });

      await getArticleId(req as Request, res as Response, next);

      expect(prisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { comment: true },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '게시물 정보 추출',
        article: expect.objectContaining({ id: 1 }),
      });
    });

    it('should return 404 if article is not found', async () => {
      req.params = { articleId: '1' };

      (prisma.article.findUnique as jest.Mock).mockResolvedValue(null);

      await getArticleId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: '게시물이 존재하지 않습니다.',
      });
    });
  });

  describe('patchArticle', () => {
    it('should update an article successfully', async () => {
      req.params = { articleId: '1' };
      req.body = { name: 'Updated Article' };
      (req as any).user = { userId: 1 };

      (prisma.article.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
      });

      (prisma.article.update as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Updated Article',
        content: 'Content 1',
      });

      await patchArticle(req as Request, res as Response, next);

      expect(prisma.article.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Updated Article',
          content: undefined,
          images: undefined,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '게시물 정보 변경 성공',
        updatedArticle: expect.objectContaining({ id: 1 }),
      });
    });
  });

  describe('deleteArticle', () => {
    it('should delete an article successfully', async () => {
      req.params = { articleId: '1' };
      (req as any).user = { userId: 1 };

      (prisma.article.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
      });

      await deleteArticle(req as Request, res as Response, next);

      expect(prisma.article.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '게시물 삭제 성공' });
    });
  });

  describe('postArticleFavorite', () => {
    it('should add a favorite to an article', async () => {
      req.params = { articleId: '1' };
      (req as any).user = { userId: 1 };

      (prisma.favorite.findUnique as jest.Mock).mockResolvedValue(null);

      await postArticleFavorite(req as Request, res as Response);

      expect(prisma.favorite.create).toHaveBeenCalled();
      expect(prisma.article.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { favoriteCount: { increment: 1 } },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '좋아요가 추가되었습니다.',
      });
    });
  });
});
