import * as productService from "../services/productService";
import prisma from "../models/index";

jest.mock("../models/index", () => ({
  product: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
  },
  favorite: {
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
}));

describe("Product Service", () => {
  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 Mock 초기화
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const mockProduct = {
        id: 1,
        name: "Test Product",
        images: [],
        price: 100,
        description: "A test product",
        tags: ["test"],
        ownerId: 1,
        ownerNickname: "TestUser",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.createProduct({
        images: [],
        name: "Test Product",
        price: 100,
        description: "A test product",
        tags: ["test"],
        userId: 1,
        userNickname: "TestUser",
      });

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          images: [],
          name: "Test Product",
          price: 100,
          description: "A test product",
          tags: ["test"],
          ownerId: 1,
          ownerNickname: "TestUser",
        },
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe("getProducts", () => {
    it("should return paginated products", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Test Product",
          images: [],
          price: 100,
          description: "A test product",
          tags: ["test"],
          ownerId: 1,
          ownerNickname: "TestUser",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockTotalCount = 1;

      (prisma.$transaction as jest.Mock).mockResolvedValue([
        mockProducts,
        mockTotalCount,
      ]);

      const result = await productService.getProducts(1, 10, "", "recent");

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.product.findMany({
          where: {},
          skip: 0,
          take: 10,
          orderBy: [{ createdAt: "desc" }],
        }),
        prisma.product.count({ where: {} }),
      ]);
      expect(result.list).toEqual(mockProducts);
      expect(result.totalCount).toBe(mockTotalCount);
    });
  });

  describe("getProductById", () => {
    it("should return a product by ID", async () => {
      const mockProduct = {
        id: 1,
        name: "Test Product",
        images: [],
        price: 100,
        description: "A test product",
        tags: ["test"],
        ownerId: 1,
        ownerNickname: "TestUser",
        createdAt: new Date(),
        updatedAt: new Date(),
        favorites: [{ id: 1 }],
      };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.getProductById({
        productId: "1",
        userId: "1",
      });

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          favorites: {
            where: { userId: 1 },
            select: { id: true },
          },
        },
      });
      expect(result.isFavorite).toBe(true);
    });

    it("should throw an error if the product is not found", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        productService.getProductById({ productId: "1", userId: "1" })
      ).rejects.toThrow("Product not found");
    });
  });

  describe("updateProduct", () => {
    it("should update a product", async () => {
      const mockProduct = {
        id: 1,
        name: "Updated Product",
        images: [],
        price: 200,
        description: "Updated description",
        tags: ["updated"],
        ownerId: 1,
        ownerNickname: "TestUser",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.product.update as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.updateProduct({
        productId: "1",
        images: [],
        name: "Updated Product",
        price: 200,
        description: "Updated description",
        tags: ["updated"],
        userId: 1,
        userNickname: "TestUser",
      });

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          images: [],
          name: "Updated Product",
          price: 200,
          description: "Updated description",
          tags: ["updated"],
          ownerId: 1,
          ownerNickname: "TestUser",
        },
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      (prisma.product.delete as jest.Mock).mockResolvedValue({});

      await productService.deleteProduct("1");

      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe("addFavorite", () => {
    it("should add a favorite to a product", async () => {
      const mockProduct = {
        id: 1,
        name: "Test Product",
        favoriteCount: 1,
      };

      (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(null); // No existing favorite
      (prisma.$transaction as jest.Mock).mockResolvedValue([mockProduct, {}]);

      const result = await productService.addFavorite({
        productId: "1",
        userId: "1",
      });

      expect(prisma.favorite.findFirst).toHaveBeenCalledWith({
        where: { productId: 1, userId: 1 },
      });
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.updatedProduct).toEqual(mockProduct);
    });

    it("should throw an error if favorite already exists", async () => {
      (prisma.favorite.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(
        productService.addFavorite({ productId: "1", userId: "1" })
      ).rejects.toThrow("이미 좋아요를 눌렀습니다.");
    });
  });

  describe("deleteFavorite", () => {
    it("should remove a favorite from a product", async () => {
      const mockProduct = {
        id: 1,
        name: "Test Product",
        favoriteCount: 0,
      };

      (prisma.favorite.findFirst as jest.Mock).mockResolvedValue({ id: 1 }); // Existing favorite
      (prisma.$transaction as jest.Mock).mockResolvedValue([mockProduct, {}]);

      const result = await productService.deleteFavorite({
        productId: "1",
        userId: "1",
      });

      expect(prisma.favorite.findFirst).toHaveBeenCalledWith({
        where: { productId: 1, userId: 1 },
      });
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.updatedProduct).toEqual(mockProduct);
    });

    it("should throw an error if no favorite exists", async () => {
      (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        productService.deleteFavorite({ productId: "1", userId: "1" })
      ).rejects.toThrow("좋아요를 누르지 않았습니다.");
    });
  });
});
