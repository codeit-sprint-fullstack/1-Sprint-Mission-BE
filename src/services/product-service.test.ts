import { Prisma, Product } from "@prisma/client";

import productService from "../services/product-service";
import prisma from "../repositories/prisma";
import productRepository from "../repositories/product-repository";
import productImageRepository from "../repositories/product-image-repository";
import productTagRepository from "../repositories/product-tag-repository";
import favoriteProductRepository from "../repositories/favorite-product-repository";
import {
  productMapper,
  productDetailMapper,
  productListMapper,
} from "../services/mappers/product-mapper";
import {
  productSelect,
  productFavoriteSelect,
  productDetailSelect,
} from "../services/selectors/product-select";

import { ORDER_BY } from "../constants/sort";

jest.mock("../repositories/prisma", () => ({
  __esModule: true,
  default: { $transaction: jest.fn() },
}));
jest.mock("../repositories/product-repository");
jest.mock("../repositories/product-image-repository");
jest.mock("../repositories/product-tag-repository");
jest.mock("../repositories/favorite-product-repository");
jest.mock("../services/mappers/product-mapper");
jest.mock("../services/selectors/product-select");

describe("Product Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("createProduct success", async () => {
      const mockCreateProductParam = {
        userId: "uuid-user-123",
        name: "Test Product",
        description: "Test Description",
        price: 10000,
        images: ["image1.jpg", "image2.jpg"],
        tags: ["tag1", "tag2"],
      };
      const mockCreateDataReturn = {
        id: "uuid-product-123",
        name: "Test Product",
        description: "Test Description",
        price: 10000,
        favoriteCount: 0,
        createdAt: new Date(),
        FavoriteProduct: [],
        ProductImage: [],
        ProductTag: [],
        User: {
          id: "uuid-user-123",
          nickname: "tester",
          image: "user profile image url",
        },
      };
      const mockFindUniqueOrThrowDataReturn = {
        id: "uuid-product-123",
        name: "Test Product",
        description: "Test Description",
        price: 10000,
        FavoriteProduct: [],
        favoriteCount: 0,
        createdAt: new Date(),
        ProductImage: [{ image: "image1.jpg" }, { image: "image2.jpg" }],
        ProductTag: [{ tag: "tag1" }, { tag: "tag2" }],
        User: {
          id: "uuid-user-123",
          nickname: "tester",
          image: "user profile image url",
        },
      };
      const mockMappedProduct = {
        id: "uuid-product-123",
        name: "Test Product",
        description: "Test Description",
        price: 10000,
        favoriteCount: 0,
        images: ["image1.jpg", "image2.jpg"],
        tags: ["tag1", "tag2"],
        ownerId: "uuid-user-123",
        ownerImage: "user profile image url",
        ownerNickname: "tester",
        isFavorite: false,
        createdAt: new Date(),
      };
      const mockProductImage = { count: 2 };
      const mockProductTag = { count: 2 };

      (productRepository.createData as jest.Mock).mockResolvedValue(
        mockCreateDataReturn
      );
      (productRepository.findUniqueOrThrowData as jest.Mock).mockResolvedValue(
        mockFindUniqueOrThrowDataReturn
      );
      (productImageRepository.createManyData as jest.Mock).mockResolvedValue(
        mockProductImage
      );
      (productTagRepository.createManyData as jest.Mock).mockResolvedValue(
        mockProductTag
      );
      (productMapper as jest.Mock).mockReturnValue(mockMappedProduct);
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => cb());

      const result = await productService.createProduct(mockCreateProductParam);

      expect(productRepository.createData).toHaveBeenCalledWith({
        data: {
          User: { connect: { id: mockCreateProductParam.userId } },
          name: mockCreateProductParam.name,
          description: mockCreateProductParam.description,
          price: mockCreateProductParam.price,
        },
        select: productSelect,
      });
      expect(productImageRepository.createManyData).toHaveBeenCalledWith([
        { productId: result.id, image: "image1.jpg" },
        { productId: result.id, image: "image2.jpg" },
      ]);
      expect(productTagRepository.createManyData).toHaveBeenCalledWith([
        { productId: result.id, tag: "tag1" },
        { productId: result.id, tag: "tag2" },
      ]);
      expect(productMapper).toHaveBeenCalledWith(
        mockFindUniqueOrThrowDataReturn
      );
      expect(result).toEqual(mockMappedProduct);
    });
  });

  describe("getProductList", () => {
    it("getProductList success", async () => {
      const mockGetProductListParam = {
        userId: "uuid-user-123",
        orderBy: "recent",
        page: 1,
        pageSize: 10,
        keyword: "test",
      };
      const mockFindManyByPaginationDataReturn = [
        {
          id: "uuid-product-123",
          name: "Test Product",
          description: "Test Description",
          price: 10000,
          FavoriteProduct: [],
          favoriteCount: 0,
          createdAt: new Date(),
          ProductImage: [{ image: "image1.jpg" }, { image: "image2.jpg" }],
          ProductTag: [{ tag: "tag1" }, { tag: "tag2" }],
          User: {
            id: "uuid-user-123",
            nickname: "tester",
            image: "user profile image url",
          },
        },
        {
          id: "uuid-product-456",
          name: "Test Product2",
          description: "Test Description2",
          price: 20000,
          FavoriteProduct: [],
          favoriteCount: 0,
          createdAt: new Date(),
          ProductImage: [{ image: "image11.jpg" }, { image: "image12.jpg" }],
          ProductTag: [{ tag: "tag1" }, { tag: "tag3" }],
          User: {
            id: "uuid-user-123",
            nickname: "tester",
            image: "user profile image url",
          },
        },
      ];
      const mockMappedProductList = {
        totalCount: 2,
        products: [
          {
            id: "uuid-product-123",
            name: "Test Product",
            description: "Test Description",
            price: 10000,
            favoriteCount: 0,
            images: ["image1.jpg", "image2.jpg"],
            tags: ["tag1", "tag2"],
            ownerId: "uuid-user-123",
            ownerImage: "user profile image url",
            ownerNickname: "tester",
            isFavorite: false,
            createdAt: new Date(),
          },
          {
            id: "uuid-product-456",
            name: "Test Product2",
            description: "Test Description2",
            price: 20000,
            favoriteCount: 0,
            images: ["image11.jpg", "image12.jpg"],
            tags: ["tag1", "tag3"],
            ownerId: "uuid-user-123",
            ownerImage: "user profile image url",
            ownerNickname: "tester",
            isFavorite: false,
            createdAt: new Date(),
          },
        ],
      };

      (productRepository.countData as jest.Mock).mockResolvedValue(2);
      (
        productRepository.findManyByPaginationData as jest.Mock
      ).mockResolvedValue(mockFindManyByPaginationDataReturn);
      (productListMapper as jest.Mock).mockReturnValue(mockMappedProductList);

      const result = await productService.getProductList(
        mockGetProductListParam
      );

      expect(productRepository.countData).toHaveBeenCalledWith({
        OR: [
          { name: { contains: mockGetProductListParam.keyword } },
          { description: { contains: mockGetProductListParam.keyword } },
        ],
      });
      expect(productRepository.findManyByPaginationData).toHaveBeenCalledWith({
        orderBy: ORDER_BY[mockGetProductListParam.orderBy],
        skip: 0,
        take: 10,
        where: {
          OR: [
            { name: { contains: mockGetProductListParam.keyword } },
            { description: { contains: mockGetProductListParam.keyword } },
          ],
        },
        select: productFavoriteSelect(mockGetProductListParam.userId),
      });
      expect(productListMapper).toHaveBeenCalledWith({
        count: 2,
        productList: mockFindManyByPaginationDataReturn,
      });
      expect(result).toEqual(mockMappedProductList);
    });
  });

  describe("getProduct", () => {
    it("should return product detail info", async () => {
      const mockFindUniqueOrThrowDataReturn = {
        id: "uuid-product-123",
        name: "Test Product",
        description: "Test Description",
        price: 10000,
        FavoriteProduct: [],
        favoriteCount: 0,
        createdAt: new Date(),
        ProductImage: [{ image: "image1.jpg" }, { image: "image2.jpg" }],
        ProductTag: [{ tag: "tag1" }, { tag: "tag2" }],
        User: {
          id: "uuid-user-123",
          nickname: "tester",
          image: "user profile image url",
        },
      };
      const mockMappedDetail = {
        id: "uuid-product-123",
        name: "Test Product",
        description: "Test Description",
        price: 10000,
        favoriteCount: 0,
        images: ["image1.jpg", "image2.jpg"],
        tags: ["tag1", "tag2"],
        ownerId: "uuid-user-123",
        ownerImage: "tester",
        ownerNickname: "user profile image url",
        isFavorite: false,
        createdAt: new Date(),
        comments: [
          {
            id: "uuid-product-comment-123",
            content: "Test content",
            ownerId: "uuid-user-123",
            ownerNickname: "tester",
            ownerImage: "user profile image url",
            createdAt: new Date(),
          },
        ],
      };
      (productRepository.findUniqueOrThrowData as jest.Mock).mockResolvedValue(
        mockFindUniqueOrThrowDataReturn
      );
      (productDetailMapper as jest.Mock).mockReturnValue(mockMappedDetail);

      const result = await productService.getProduct({
        userId: "uuid-user-123",
        productId: "uuid-product-123",
      });

      expect(productRepository.findUniqueOrThrowData).toHaveBeenCalledWith({
        where: { id: "uuid-product-123" },
        select: productDetailSelect(mockFindUniqueOrThrowDataReturn.id),
      });
      expect(productDetailMapper).toHaveBeenCalledWith(
        mockFindUniqueOrThrowDataReturn
      );
      expect(result).toEqual(mockMappedDetail);
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      type MockProduct = {
        id: string;
        name: string;
        description: string;
        price: number;
        FavoriteProduct: {
          id: string;
        }[];
        favoriteCount: number;
        createdAt: Date;
        ProductImage: {
          image: string;
        }[];
        ProductTag: {
          tag: string;
        }[];
        User: {
          id: string;
          nickname: string;
          image: string;
        };
      };

      const mockDeleteDataReturn: MockProduct = {
        id: "uuid-product-123",
        name: "Test Product",
        description: "Test Description",
        price: 10000,
        FavoriteProduct: [],
        favoriteCount: 0,
        createdAt: new Date(),
        ProductImage: [{ image: "image1.jpg" }, { image: "image2.jpg" }],
        ProductTag: [{ tag: "tag1" }, { tag: "tag2" }],
        User: {
          id: "uuid-user-123",
          nickname: "tester",
          image: "user profile image url",
        },
      };
      (productRepository.deleteData as jest.Mock).mockResolvedValue(
        mockDeleteDataReturn
      );

      const result = await productService.deleteProduct(
        mockDeleteDataReturn.id
      );

      expect(productRepository.deleteData).toHaveBeenCalledWith({
        id: "uuid-product-123",
      });
      expect(result).not.toBeNull();
    });
  });

  describe("increaseProductFavorite", () => {
    it("increaseProductFavorite success", async () => {
      const mockCreateDataReturn = {
        id: "uuid-favorite-product-123",
        userId: "uuid-product-123",
        productId: "uuid-product-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockUpdateDataReturn = {
        id: "uuid-product-123",
        name: "Test Product",
        description: "Test Description",
        price: 10000,
        FavoriteProduct: [{ id: "uuid-product-123" }],
        favoriteCount: 1,
        createdAt: new Date(),
        ProductImage: [{ image: "image1.jpg" }, { image: "image2.jpg" }],
        ProductTag: [{ tag: "tag1" }, { tag: "tag2" }],
        User: {
          id: "uuid-user-123",
          nickname: "tester",
          image: "user profile image url",
        },
      };
      const mockMappedProduct = {
        id: "uuid-product-123",
        name: "Test Product",
        description: "Test Description",
        price: 10000,
        favoriteCount: 1,
        images: ["image1.jpg", "image2.jpg"],
        tags: ["tag1", "tag2"],
        ownerId: "uuid-user-123",
        ownerImage: "tester",
        ownerNickname: "user profile image url",
        isFavorite: true,
        createdAt: new Date(),
      };

      (favoriteProductRepository.createData as jest.Mock).mockResolvedValue(
        mockCreateDataReturn
      );
      (productRepository.updateData as jest.Mock).mockResolvedValue(
        mockUpdateDataReturn
      );
      (productMapper as jest.Mock).mockReturnValue(mockMappedProduct);
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => cb());

      const result = await productService.increaseProductFavorite({
        userId: "uuid-user-123",
        productId: "uuid-product-123",
      });

      expect(favoriteProductRepository.createData).toHaveBeenCalledWith({
        data: {
          User: {
            connect: { id: "uuid-user-123" },
          },
          Product: {
            connect: { id: "uuid-product-123" },
          },
        },
      });
      expect(productRepository.updateData).toHaveBeenCalledWith({
        where: { id: "uuid-product-123" },
        data: { favoriteCount: { increment: 1 } },
        select: productFavoriteSelect(mockCreateDataReturn.productId),
      });
      expect(productMapper).toHaveBeenCalledWith(mockUpdateDataReturn);
      expect(result).toEqual(mockMappedProduct);
    });
  });

  describe("decreaseProductFavorite", () => {
    it("decreaseProductFavorite success", async () => {
      const mockDeleteDataReturn = {
        id: "uuid-favorite-product-123",
        userId: "uuid-product-123",
        productId: "uuid-product-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockUpdateDataReturn = {
        id: "uuid-product-123",
        name: "Test Product",
        description: "Test Description",
        price: 10000,
        FavoriteProduct: [],
        favoriteCount: 0,
        createdAt: new Date(),
        ProductImage: [{ image: "image1.jpg" }, { image: "image2.jpg" }],
        ProductTag: [{ tag: "tag1" }, { tag: "tag2" }],
        User: {
          id: "uuid-user-123",
          nickname: "tester",
          image: "user profile image url",
        },
      };
      const mockMappedProduct = {
        id: "uuid-product-123",
        name: "Test Product",
        description: "Test Description",
        price: 10000,
        favoriteCount: 0,
        images: ["image1.jpg", "image2.jpg"],
        tags: ["tag1", "tag2"],
        ownerId: "uuid-user-123",
        ownerImage: "tester",
        ownerNickname: "user profile image url",
        isFavorite: false,
        createdAt: new Date(),
      };

      (favoriteProductRepository.createData as jest.Mock).mockResolvedValue(
        mockDeleteDataReturn
      );
      (productRepository.updateData as jest.Mock).mockResolvedValue(
        mockUpdateDataReturn
      );
      (productMapper as jest.Mock).mockReturnValue(mockMappedProduct);
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => cb());

      const result = await productService.decreaseProductFavorite({
        userId: "uuid-user-123",
        productId: "uuid-product-123",
      });

      expect(favoriteProductRepository.deleteData).toHaveBeenCalledWith({
        userId_productId: {
          userId: "uuid-user-123",
          productId: "uuid-product-123",
        },
      });
      expect(productRepository.updateData).toHaveBeenCalledWith({
        where: { id: "uuid-product-123" },
        data: { favoriteCount: { decrement: 1 } },
        select: productFavoriteSelect(mockDeleteDataReturn.productId),
      });
      expect(productMapper).toHaveBeenCalledWith(mockUpdateDataReturn);
      expect(result).toEqual(mockMappedProduct);
    });
  });
});
