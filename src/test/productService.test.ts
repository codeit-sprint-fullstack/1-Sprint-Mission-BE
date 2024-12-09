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

  const parseId = (id: string | number): number => {
    if (typeof id !== "string" && typeof id !== "number") {
      throw new Error("Invalid ID format");
    }
    return parseInt(id.toString(), 10);
  };

  describe("parseId", () => {
    it("should parse valid string and number IDs correctly", () => {
      expect(parseId("123")).toBe(123);
      expect(parseId(456)).toBe(456);
    });

    it("should throw an error for invalid ID types", () => {
      // @ts-expect-error: This test is deliberately passing invalid types to test the error handling
      expect(() => parseId(null)).toThrow("Invalid ID format");
      // @ts-expect-error: Same reason as above
      expect(() => parseId(undefined)).toThrow("Invalid ID format");
      // @ts-expect-error: Same reason as above
      expect(() => parseId(true)).toThrow("Invalid ID format");
      // @ts-expect-error: Same reason as above
      expect(() => parseId({})).toThrow("Invalid ID format");
      // @ts-expect-error: Same reason as above
      expect(() => parseId([])).toThrow("Invalid ID format");
    });
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

    it("should handle keyword search", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Keyword Match",
          description: "Keyword found here",
          images: [],
          price: 100,
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

      const result = await productService.getProducts(
        1,
        10,
        "Keyword",
        "recent"
      );

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.product.findMany({
          where: {
            OR: [
              { name: { contains: "Keyword", mode: "insensitive" } },
              { description: { contains: "Keyword", mode: "insensitive" } },
            ],
          },
          skip: 0,
          take: 10,
          orderBy: [{ createdAt: "desc" }],
        }),
        prisma.product.count({
          where: {
            OR: [
              { name: { contains: "Keyword", mode: "insensitive" } },
              { description: { contains: "Keyword", mode: "insensitive" } },
            ],
          },
        }),
      ]);
      expect(result.list).toEqual(mockProducts);
      expect(result.totalCount).toBe(mockTotalCount);
    });

    it("should handle favorite order", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Popular Product",
          images: [],
          price: 100,
          description: "Favorite product",
          tags: ["favorite"],
          favoriteCount: 10,
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

      const result = await productService.getProducts(1, 10, "", "favorite");

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.product.findMany({
          where: {},
          skip: 0,
          take: 10,
          orderBy: [{ favoriteCount: "desc" }, { createdAt: "desc" }],
        }),
        prisma.product.count({ where: {} }),
      ]);
      expect(result.list).toEqual(mockProducts);
      expect(result.totalCount).toBe(mockTotalCount);
    });

    it("should handle non-favorite and non-recent order", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Other Ordered Product",
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

      const result = await productService.getProducts(1, 10, "", "other");

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.product.findMany({
          where: {},
          skip: 0,
          take: 10,
          orderBy: [{ createdAt: "desc" }], // Default to "recent"
        }),
        prisma.product.count({ where: {} }),
      ]);
      expect(result.list).toEqual(mockProducts);
      expect(result.totalCount).toBe(mockTotalCount);
    });

    it("should handle no keyword for search", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Product without Keyword",
          images: [],
          price: 100,
          description: "No keyword here",
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

      const result = await productService.getProducts(1, 10, "");

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.product.findMany({
          where: {}, // No keyword condition
          skip: 0,
          take: 10,
          orderBy: [{ createdAt: "desc" }],
        }),
        prisma.product.count({ where: {} }),
      ]);
      expect(result.list).toEqual(mockProducts);
      expect(result.totalCount).toBe(mockTotalCount);
    });

    it("should handle invalid orderBy values gracefully", async () => {
      const mockProducts = [
        {
          id: 1,
          name: "Default Ordered Product",
          images: [],
          price: 100,
          description: "Default sorting applied",
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

      const result = await productService.getProducts(1, 10, "", "invalid");

      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.product.findMany({
          where: {},
          skip: 0,
          take: 10,
          orderBy: [{ createdAt: "desc" }], // 기본 정렬 조건
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

    it("should throw an error when increment is true and a favorite already exists", async () => {
      (prisma.favorite.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(
        productService.addFavorite({ productId: "1", userId: "1" })
      ).rejects.toThrow("이미 좋아요를 눌렀습니다.");
    });

    it("should throw an error when increment is false and no favorite exists", async () => {
      (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        productService.deleteFavorite({ productId: "1", userId: "1" })
      ).rejects.toThrow("좋아요를 누르지 않았습니다.");
    });

    it("should add a favorite when increment is true and no existing favorite", async () => {
      const mockProduct = {
        id: 1,
        name: "Product",
        favoriteCount: 1,
      };

      (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(null); // 기존 좋아요 없음
      (prisma.$transaction as jest.Mock).mockResolvedValue([mockProduct, {}]);

      const result = await productService.addFavorite({
        productId: "1",
        userId: "1",
      });
      expect(result.updatedProduct.favoriteCount).toBe(1);
    });

    it("should increment favorite count when adding a favorite", async () => {
      const mockProduct = {
        id: 1,
        name: "Product",
        favoriteCount: 1,
      };

      (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.$transaction as jest.Mock).mockResolvedValue([mockProduct, {}]);

      const result = await productService.addFavorite({
        productId: "1",
        userId: "1",
      });

      expect(prisma.favorite.findFirst).toHaveBeenCalledWith({
        where: { productId: 1, userId: 1 },
      });
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.updatedProduct.favoriteCount).toBe(1);
    });

    it("should decrement favorite count when removing a favorite", async () => {
      const mockProduct = {
        id: 1,
        name: "Product",
        favoriteCount: 0,
      };

      (prisma.favorite.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.$transaction as jest.Mock).mockResolvedValue([mockProduct, {}]);

      const result = await productService.deleteFavorite({
        productId: "1",
        userId: "1",
      });
      expect(result.updatedProduct.favoriteCount).toBe(0);
    });

    it("should update a product with minimal fields", async () => {
      const mockProduct = {
        id: 1,
        name: "Updated Product",
        images: [],
        price: 200,
        description: "",
        tags: [],
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
        description: "",
        tags: [],
        userId: 1,
        userNickname: "TestUser",
      });

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          images: [],
          name: "Updated Product",
          price: 200,
          description: "",
          tags: [],
          ownerId: 1,
          ownerNickname: "TestUser",
        },
      });
      expect(result).toEqual(mockProduct);
    });

    it("should throw an error for invalid productId", async () => {
      (prisma.product.update as jest.Mock).mockRejectedValue(
        new Error("Product not found")
      );

      await expect(
        productService.updateProduct({
          productId: "invalid",
          images: [],
          name: "Invalid Product",
          price: 0,
          description: "",
          tags: [],
          userId: 1,
          userNickname: "TestUser",
        })
      ).rejects.toThrow("Product not found");
    });

    it("should handle null or undefined fields gracefully", async () => {
      const mockProduct = {
        id: 1,
        name: "Default Product",
        images: [],
        price: 100,
        description: "Default description",
        tags: [],
        ownerId: 1,
        ownerNickname: "TestUser",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.product.update as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.updateProduct({
        productId: "1",
        images: undefined,
        name: undefined,
        price: 100,
        description: "Default description",
        tags: undefined,
        userId: 1,
        userNickname: "TestUser",
      });

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          images: [],
          name: "",
          price: 100,
          description: "Default description",
          tags: [],
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
