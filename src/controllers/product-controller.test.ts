import { Request, Response, NextFunction } from "express";
import productController from "./product-controller";
import productService from "../services/product-service";
import {
  ProductBaseInfo,
  ProductListInfo,
  ProductDetailInfo,
} from "../types/product-types";
// 에러 관련 테스트도 작성을 계획했으나, CRUD 로직의 유닛 테스트 자체가 비효율적이고 의미없어서 작성 안함
import { CustomError } from "../utils/error";

jest.mock("../services/product-service");

describe("Product Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      locals: {
        userId: "uuid-user-123",
      },
    };
    mockNext = jest.fn();
  });

  describe("createProduct", () => {
    test("createProduct success : status(201)", async () => {
      const mockProduct: ProductBaseInfo = {
        id: "uuid-product-123",
        name: "test product",
        description: "test description",
        price: 10000,
        favoriteCount: 0,
        images: ["image url1", "image url2"],
        tags: ["tag1", "tag2"],
        ownerId: "uuid-owner-user-123",
        ownerImage: "owner profile image url",
        ownerNickname: "tester",
        isFavorite: false,
        createdAt: new Date(),
      };

      mockReq.body = {
        name: "test product",
        description: "test description",
        price: "10000",
        images: ["image url1", "image url2"],
        tags: ["tag1", "tag2"],
      };
      (productService.createProduct as jest.Mock).mockResolvedValue(
        mockProduct
      );

      await productController.createProduct(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(productService.createProduct).toHaveBeenCalledWith({
        userId: "uuid-user-123",
        name: "test product",
        description: "test description",
        price: 10000,
        images: ["image url1", "image url2"],
        tags: ["tag1", "tag2"],
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe("getProductList", () => {
    test("getProductList success : status(200)", async () => {
      const mockProductList: ProductListInfo = {
        totalCount: 1,
        products: [
          {
            id: "uuid-product-123",
            name: "test product",
            description: "test description",
            price: 10000,
            favoriteCount: 0,
            images: ["image url1", "image url2"],
            tags: ["tag1", "tag2"],
            ownerId: "uuid-owner-user-123",
            ownerImage: "owner profile image url",
            ownerNickname: "tester",
            isFavorite: false,
            createdAt: new Date(),
          },
        ],
      };

      mockReq.query = {
        orderBy: "recent",
        page: "1",
        pageSize: "10",
        keyword: "test",
      };
      (productService.getProductList as jest.Mock).mockResolvedValue(
        mockProductList
      );

      await productController.getProductList(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(productService.getProductList).toHaveBeenCalledWith({
        userId: "uuid-user-123",
        orderBy: "recent",
        page: "1",
        pageSize: "10",
        keyword: "test",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProductList);
    });
  });

  describe("getProduct", () => {
    test("getProduct success : status(200)", async () => {
      const mockProduct: ProductDetailInfo = {
        id: "uuid-product-123",
        name: "test product",
        description: "test description",
        price: 10000,
        favoriteCount: 0,
        images: ["image url1", "image url2"],
        tags: ["tag1", "tag2"],
        ownerId: "uuid-owner-user-123",
        ownerImage: "owner profile image url",
        ownerNickname: "tester",
        isFavorite: false,
        createdAt: new Date(),
        comments: [
          {
            id: "uuid-product-comment-123",
            content: "comment content",
            ownerId: "uuid-owner-user-123",
            ownerNickname: "comment owner nickname",
            ownerImage: "comment owner profile image url",
            createdAt: new Date(),
          },
        ],
      };

      mockReq.params = {
        productId: "uuid-product-123",
      };
      (productService.getProduct as jest.Mock).mockResolvedValue(mockProduct);

      await productController.getProduct(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(productService.getProduct).toHaveBeenCalledWith({
        userId: "uuid-user-123",
        productId: "uuid-product-123",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe("modifyProduct", () => {
    test("modifyProduct success : status(200)", async () => {
      const mockProduct: ProductBaseInfo = {
        id: "uuid-product-123",
        name: "test product_",
        description: "test description_",
        price: 90000,
        favoriteCount: 0,
        images: ["image url1"],
        tags: ["tag1", "tag2", "tag3"],
        ownerId: "uuid-owner-user-123",
        ownerImage: "owner profile image url",
        ownerNickname: "tester",
        isFavorite: false,
        createdAt: new Date(),
      };

      mockReq.params = { productId: "uuid-product-123" };
      mockRes.locals = { userId: "uuid-user-123" };
      mockReq.body = {
        name: "test product_",
        description: "test description_",
        price: "90000",
        images: ["image url1"],
        tags: ["tag1", "tag2", "tag3"],
      };
      (productService.modifyProduct as jest.Mock).mockResolvedValue(
        mockProduct
      );

      await productController.modifyProduct(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(productService.modifyProduct).toHaveBeenCalledWith({
        userId: "uuid-user-123",
        productId: "uuid-product-123",
        name: "test product_",
        description: "test description_",
        price: 90000,
        images: ["image url1"],
        tags: ["tag1", "tag2", "tag3"],
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe("deleteProduct", () => {
    test("deleteProduct success : status(200)", async () => {
      mockReq.params = { productId: "uuid-product-123" };
      (productService.deleteProduct as jest.Mock).mockResolvedValue(null);

      await productController.deleteProduct(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(productService.deleteProduct).toHaveBeenCalledWith(
        "uuid-product-123"
      );
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });
  });

  describe("increaseProductFavorite", () => {
    test("increaseProductFavorite success : status(200)", async () => {
      const mockProduct: ProductBaseInfo = {
        id: "uuid-product-123",
        name: "test product",
        description: "test description",
        price: 10000,
        favoriteCount: 0,
        images: ["image url1", "image url2"],
        tags: ["tag1", "tag2"],
        ownerId: "uuid-owner-user-123",
        ownerImage: "owner profile image url",
        ownerNickname: "tester",
        isFavorite: true,
        createdAt: new Date(),
      };
      mockReq.params = { productId: "uuid-product-123" };
      mockRes.locals = { userId: "uuid-user-123" };
      (productService.increaseProductFavorite as jest.Mock).mockResolvedValue(
        mockProduct
      );

      await productController.increaseProductFavorite(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(productService.increaseProductFavorite).toHaveBeenCalledWith({
        userId: "uuid-user-123",
        productId: "uuid-product-123",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe("decreaseProductFavorite", () => {
    test("decreaseProductFavorite success : status(200)", async () => {
      const mockProduct: ProductBaseInfo = {
        id: "uuid-product-123",
        name: "test product",
        description: "test description",
        price: 10000,
        favoriteCount: 0,
        images: ["image url1", "image url2"],
        tags: ["tag1", "tag2"],
        ownerId: "uuid-owner-user-123",
        ownerImage: "owner profile image url",
        ownerNickname: "tester",
        isFavorite: false,
        createdAt: new Date(),
      };
      mockReq.params = { productId: "uuid-product-123" };
      mockRes.locals = { userId: "uuid-user-123" };
      (productService.decreaseProductFavorite as jest.Mock).mockResolvedValue(
        mockProduct
      );

      await productController.decreaseProductFavorite(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(productService.decreaseProductFavorite).toHaveBeenCalledWith({
        userId: "uuid-user-123",
        productId: "uuid-product-123",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProduct);
    });
  });
});
