import {
  getProducts,
  postProduct,
  getProductId,
  deleteProduct,
  patchProduct,
  postFavorites,
} from './productController';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user: {
    userId: number;
    email?: string;
  };
}

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
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

describe('Product Controller', () => {
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

  describe('getProducts', () => {
    it('should return products successfully', async () => {
      req.query = { page: '1', pageSize: '10' };

      (prisma.product.findMany as jest.Mock).mockResolvedValue([
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          createdAt: new Date(),
        },
      ]);

      await getProducts(req as Request, res as Response, next);

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '상품 정보 추출',
        products: expect.any(Array),
      });
    });
  });

  describe('postProduct', () => {
    it('should create a new product and return success response', async () => {
      req.body = {
        name: 'Test Product',
        description: 'This is a test product',
        price: '100',
        tags: ['tag1', 'tag2'],
        images: ['image1.jpg', 'image2.jpg'],
      };
      (req as any).user = { userId: 1 };

      (prisma.product.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        tags: ['tag1', 'tag2'],
        images: ['image1.jpg', 'image2.jpg'],
        userId: 1,
      });

      await postProduct(req as CustomRequest, res as Response, next);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Product',
          description: 'This is a test product',
          price: 100,
          tags: ['tag1', 'tag2'],
          images: ['image1.jpg', 'image2.jpg'],
          userId: 1,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: '상품 정보 추가 성공',
        product: expect.objectContaining({
          id: 1,
          name: 'Test Product',
        }),
      });
    });
  });

  describe('getProductId', () => {
    it('should return a specific product', async () => {
      req.params = { productId: '1' };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
      });

      await getProductId(req as Request, res as Response, next);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '상품 정보 추출',
        product: expect.objectContaining({ id: 1 }),
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      req.params = { productId: '1' };
      req.user = { userId: 1 };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
      });

      (prisma.product.delete as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Deleted Product',
        description: 'This product has been deleted.',
      });

      await deleteProduct(req as CustomRequest, res as Response, next);

      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '상품 정보 삭제 성공',
        deletedProduct: expect.objectContaining({ id: 1 }),
      });
    });
  });

  describe('patchProduct', () => {
    it('should update a product successfully', async () => {
      req.params = { productId: '1' };
      req.body = { name: 'Updated Product' };
      (req as any).user = { userId: 1 };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
      });

      (prisma.product.update as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Updated Product',
        description: 'Description 1',
      });

      await patchProduct(req as CustomRequest, res as Response, next);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Updated Product',
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: '상품 정보 변경 성공',
        updatedProduct: expect.objectContaining({ id: 1 }),
      });
    });
  });

  describe('postFavorites', () => {
    it('should add a favorite to a product', async () => {
      req.params = { productId: '1' };
      (req as any).user = { userId: 1 };

      (prisma.favorite.findUnique as jest.Mock).mockResolvedValue(null);

      await postFavorites(req as CustomRequest, res as Response);

      expect(prisma.favorite.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          productId: 1,
        },
      });
      expect(prisma.product.update).toHaveBeenCalledWith({
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
