import { Request, Response, NextFunction } from "express";
import productCommentController from "./product-comment-controller";
import productCommentService from "../services/product-comment-service";
import {
  ProductCommentBaseInfo,
  ProductCommentListInfo,
} from "../types/product-comment-types";

jest.mock("../services/product-comment-service");

describe("Product Comment Controller", () => {
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

  describe("createProductComment", () => {
    test("createProductComment success : status(201)", async () => {
      const mockProductComment: ProductCommentBaseInfo = {
        id: "uuid-product-comment-456",
        productId: "uuid-product-123",
        content: "test content",
        ownerId: "uuid-owner-user-123",
        ownerImage: "owner profile image url",
        ownerNickname: "tester",
        createdAt: new Date(),
      };

      mockReq.body = {
        productId: "uuid-product-123",
        content: "test content",
      };
      (
        productCommentService.createProductComment as jest.Mock
      ).mockResolvedValue(mockProductComment);

      await productCommentController.createProductComment(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(productCommentService.createProductComment).toHaveBeenCalledWith({
        userId: "uuid-user-123",
        productId: "uuid-product-123",
        content: "test content",
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith(mockProductComment);
    });
  });

  describe("getProductCommentList", () => {
    test("getProductCommentList success : status(200)", async () => {
      const mockProductListComment: ProductCommentListInfo = {
        totalCount: 1,
        comments: [
          {
            id: "uuid-product-comment-456",
            productId: "uuid-product-123",
            content: "test comment",
            ownerId: "uuid-owner-user-123",
            ownerImage: "owner profile image url",
            ownerNickname: "tester",
            createdAt: new Date(),
          },
        ],
      };

      mockReq.params = { productId: "uuid-product-123" };
      mockReq.query = {
        orderBy: "recent",
        page: "1",
        pageSize: "10",
      };

      (
        productCommentService.getProductCommentList as jest.Mock
      ).mockResolvedValue(mockProductListComment);

      await productCommentController.getProductCommentList(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(productCommentService.getProductCommentList).toHaveBeenCalledWith({
        productId: "uuid-product-123",
        orderBy: "recent",
        page: "1",
        pageSize: "10",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProductListComment);
    });
  });

  describe("getProductComment", () => {
    test("getProductComment success : status(200)", async () => {
      const mockProductComment: ProductCommentBaseInfo = {
        id: "uuid-product-comment-456",
        productId: "uuid-product-123",
        content: "test content",
        ownerId: "uuid-owner-user-123",
        ownerImage: "owner profile image url",
        ownerNickname: "tester",
        createdAt: new Date(),
      };

      mockReq.params = { productCommentId: "1" };

      (productCommentService.getProductComment as jest.Mock).mockResolvedValue(
        mockProductComment
      );

      await productCommentController.getProductComment(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(productCommentService.getProductComment).toHaveBeenCalledWith("1");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProductComment);
    });
  });

  describe("modifyProductComment", () => {
    test("modifyProductComment success : status(200)", async () => {
      const mockProductComment: ProductCommentBaseInfo = {
        id: "uuid-product-comment-456",
        productId: "uuid-product-123",
        content: "test content_",
        ownerId: "uuid-owner-user-123",
        ownerImage: "owner profile image url",
        ownerNickname: "tester",
        createdAt: new Date(),
      };

      mockReq.params = { productCommentId: "1" };
      mockReq.body = {
        content: "test content_",
      };

      (
        productCommentService.modifyProductComment as jest.Mock
      ).mockResolvedValue(mockProductComment);

      await productCommentController.modifyProductComment(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(productCommentService.modifyProductComment).toHaveBeenCalledWith({
        productCommentId: "1",
        content: "test content_",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockProductComment);
    });
  });

  describe("deleteProductComment", () => {
    test("deleteProductComment success : status(200)", async () => {
      mockReq.params = { productCommentId: "1" };

      (
        productCommentService.deleteProductComment as jest.Mock
      ).mockResolvedValue(null);

      await productCommentController.deleteProductComment(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(productCommentService.deleteProductComment).toHaveBeenCalledWith(
        "1"
      );
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });
  });
});
