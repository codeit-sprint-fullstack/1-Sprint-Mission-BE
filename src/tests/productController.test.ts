import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController';
import prisma from '../utils/prismaClient';
import { Request, Response, NextFunction } from 'express';

jest.mock('../utils/prismaClient');

describe('Product CRUD Operations', () => {
  const mockProduct = {
    id: 1,
    name: '아이바오 부채',
    description: '아이바오의 얼굴이 그려져있는 부채입니다.',
    price: 100,
    tags: [],
    image: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: [],
    comments: [],
  };

  const createMockRequest = (body: object, userId: number, params?: Record<string, string>, query?: Record<string, any>): Request => ({
    body: body,
    user: { id: userId },
    params: params || {},
    query: query || {},
  } as Request);

  const createMockResponse = (): Response => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response);

  const next: NextFunction = jest.fn();

  describe('Create Product', () => {
    it('should create a product successfully', async () => { // 상품을 성공적으로 생성
      (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);
      const req = createMockRequest(mockProduct, 1);
      const res = createMockResponse();

      await createProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle errors during product creation', async () => {
      (prisma.product.create as jest.Mock).mockRejectedValue(new Error('데이터베이스 오류'));
      const req = createMockRequest(mockProduct, 1);
      const res = createMockResponse();

      await createProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    }); // 상품 생성 중 오류가 발생하면 오류를 next()로 전달해야 함.
  });

  describe('Get Products', () => {
    it('should retrieve a list of products', async () => { // 상품 목록을 성공적으로 조회
      (prisma.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);
      (prisma.product.count as jest.Mock).mockResolvedValue(1);
      const req = createMockRequest({}, 1, {}, { page: 1, pageSize: 10, orderBy: 'recent', keyword: '' });
      const res = createMockResponse();

      await getProducts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ totalCount: 1, list: [mockProduct] });
    });

    it('should handle errors during product retrieval', async () => {
      (prisma.product.findMany as jest.Mock).mockRejectedValue(new Error('데이터베이스 오류'));
      const req = createMockRequest({}, 1, {}, { page: 1, pageSize: 10, orderBy: 'recent', keyword: '' });
      const res = createMockResponse();

      await getProducts(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    }); // 상품 조회 중 오류가 발생하면 오류를 next()로 전달해야 함.
  });

  describe('Get Product by ID', () => {
    it('should retrieve a product by ID', async () => { // ID로 상품을 성공적으로 조회
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      const req = createMockRequest({}, 1, { productId: '1' });
      const res = createMockResponse();

      await getProductById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ...mockProduct, isFavorite: false });
    });

    it('should return 404 if product not found', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);
      const req = createMockRequest({}, 1, { productId: '1' });
      const res = createMockResponse();

      await getProductById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "해당 상품을 찾을 수 없습니다." });
    }); // 상품이 없을 경우 404 상태와 에러 메시지를 반환해야 함.

    it('should handle errors during product retrieval by ID', async () => {
      (prisma.product.findUnique as jest.Mock).mockRejectedValue(new Error('데이터베이스 오류'));
      const req = createMockRequest({}, 1, { productId: '1' });
      const res = createMockResponse();

      await getProductById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    }); // ID로 상품 조회 중 오류가 발생하면 오류를 next()로 전달해야 함.
  });

  describe('Update Product', () => {
    it('should update a product successfully', async () => { // 상품을 성공적으로 수정
      (prisma.product.update as jest.Mock).mockResolvedValue(mockProduct);
      const req = createMockRequest(mockProduct, 1, { productId: '1' });
      const res = createMockResponse();

      await updateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle errors during product update', async () => {
      (prisma.product.update as jest.Mock).mockRejectedValue(new Error('데이터베이스 오류'));
      const req = createMockRequest(mockProduct, 1, { productId: '1' });
      const res = createMockResponse();

      await updateProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    }); // 상품 수정 중 오류가 발생하면 오류를 next()로 전달해야 함.
  });

  describe('Delete Product', () => {
    it('should delete a product successfully', async () => { // 상품을 성공적으로 삭제
      (prisma.product.delete as jest.Mock).mockResolvedValue(mockProduct);
      const req = createMockRequest({}, 1, { productId: '1' });
      const res = createMockResponse();

      await deleteProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: '1' });
    });

    it('should handle errors during product deletion', async () => {
      (prisma.product.delete as jest.Mock).mockRejectedValue(new Error('데이터베이스 오류'));
      const req = createMockRequest({}, 1, { productId: '1' });
      const res = createMockResponse();

      await deleteProduct(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    }); // 상품 삭제 중 오류가 발생하면 오류를 next()로 전달해야 함.
  });
});

