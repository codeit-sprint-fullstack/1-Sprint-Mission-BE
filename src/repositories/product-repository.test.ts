import { Prisma } from "@prisma/client";

import prisma from "./prisma";
import productRepository from "./product-repository";

jest.mock("./prisma", () => ({
  __esModule: true,
  default: {
    product: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("Product Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createData", () => {
    it("createData success", async () => {
      const mockProduct = {
        id: "uuid-product-123",
        name: "Test Product",
        description: "This is a test product.",
        price: 1000,
        userId: "uuid-user-123",
        User: {
          id: "uuid-user-123",
          email: "user@example.com",
          name: "Test User",
          nickname: "testuser",
        },
      };

      const inputData = {
        name: "Test Product",
        description: "This is a test product.",
        price: 1000,
        userId: "uuid-user-123",
        User: { connect: { id: "uuid-user-123" } },
      };

      (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productRepository.createData({
        data: inputData,
        select: { id: true, name: true, description: true, price: true },
      });

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: inputData,
        select: { id: true, name: true, description: true, price: true },
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe("countData", () => {
    it("countData success", async () => {
      const mockWhere = { userId: "uuid-user-123" };
      const mockCount = 3;

      (prisma.product.count as jest.Mock).mockResolvedValue(mockCount);

      const result = await productRepository.countData(mockWhere);

      expect(prisma.product.count).toHaveBeenCalledWith({ where: mockWhere });
      expect(result).toBe(mockCount);
    });
  });

  describe("findManyByPaginationData", () => {
    it("findManyByPaginationData success", async () => {
      const mockProducts = [
        { id: "uuid-1", name: "Product 1", price: 1000 },
        { id: "uuid-2", name: "Product 2", price: 2000 },
      ];

      const inputParams = {
        orderBy: { createdAt: Prisma.SortOrder.desc },
        skip: 0,
        take: 2,
        where: { userId: "uuid-user-123" },
        select: { id: true, name: true, price: true },
      };

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await productRepository.findManyByPaginationData(
        inputParams
      );

      expect(prisma.product.findMany).toHaveBeenCalledWith(inputParams);
      expect(result).toEqual(mockProducts);
    });
  });

  describe("findUniqueOrThrowData", () => {
    it("findUniqueOrThrowData success", async () => {
      const mockProduct = {
        id: "uuid-product-123",
        name: "Test Product",
        description: "This is a test product.",
        price: 10000,
      };

      const inputParams = {
        where: { id: "uuid-product-123" },
        select: { id: true, name: true, description: true, price: true },
      };

      (prisma.product.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const result = await productRepository.findUniqueOrThrowData(inputParams);

      expect(prisma.product.findUniqueOrThrow).toHaveBeenCalledWith(
        inputParams
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe("updateData", () => {
    it("updateData success", async () => {
      const mockProduct = {
        id: "uuid-product-123",
        name: "Updated Product",
        price: 90000,
      };

      const inputParams = {
        where: { id: "uuid-product-123" },
        data: { name: "Updated Product", price: 1500 },
        select: { id: true, name: true, price: true },
      };

      (prisma.product.update as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productRepository.updateData(inputParams);

      expect(prisma.product.update).toHaveBeenCalledWith(inputParams);
      expect(result).toEqual(mockProduct);
    });
  });

  describe("deleteData", () => {
    it("deleteData success", async () => {
      const mockWhere = { id: "uuid-product-123" };

      (prisma.product.delete as jest.Mock).mockResolvedValue(undefined);

      await productRepository.deleteData(mockWhere);

      expect(prisma.product.delete).toHaveBeenCalledWith({ where: mockWhere });
    });
  });
});
