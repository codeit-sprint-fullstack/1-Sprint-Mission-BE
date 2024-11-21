import productService from "../services/productService";
import productRepository from "../repositorys/productRepository";

const product = {
  id: "uuid",
  name: "product name 1",
  description: "상품설명",
  price: 50000,
  tags: ["상품", "태그", "입니다"],
  images: ["URL images"],
  ownerId: "1",
  createAt: new Date(),
  updateAt: new Date(),
  favoriteCount: 1,
};

const mockData = {
  name: "product name 1",
  description: "상품설명",
  price: 50000,
  tags: ["상품", "태그", "입니다"],
  images: ["URL images"],
  ownerId: "1",
};

jest.mock("../repositorys/productRepository");

describe("Product Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    test("should return products and metadata", async () => {
      // Mock repository 함수
      (productRepository.getTotalCount as jest.Mock).mockResolvedValue(20);
      (productRepository.getList as jest.Mock).mockResolvedValue([product]);

      // 테스트 데이터
      const query = {
        page: "1",
        pageSize: "10",
        orderBy: "recent",
        keyword: "",
      };

      // 호출
      const result = await productService.getProducts({ query } as any);

      // 검증
      expect(productRepository.getTotalCount).toHaveBeenCalledWith({});
      expect(productRepository.getList).toHaveBeenCalledWith(
        10, // pageSize
        0, // offset
        { createAt: "desc" }, // orderOption
        {} // whereConditions
      );
      expect(result).toEqual({
        totalCount: 20,
        products: [product],
        hasMore: true,
      });
    });

    test("should handle search keywords", async () => {
      // Mock repository 함수
      (productRepository.getTotalCount as jest.Mock).mockResolvedValue(5);
      (productRepository.getList as jest.Mock).mockResolvedValue([
        product,
        product,
      ]);

      // 테스트 데이터
      const query = {
        page: "1",
        pageSize: "5",
        orderBy: "recent",
        keyword: "Keyword",
      };

      // 호출
      const result = await productService.getProducts({ query } as any);

      // 검증
      expect(productRepository.getTotalCount).toHaveBeenCalledWith({
        OR: [
          { name: { contains: "Keyword", mode: "insensitive" } },
          { description: { contains: "Keyword", mode: "insensitive" } },
        ],
      });
      expect(result).toEqual({
        totalCount: 5,
        products: [product, product],
        hasMore: false,
      });
    });

    test("should return an empty list if no products found", async () => {
      // Mock repository 함수
      (productRepository.getTotalCount as jest.Mock).mockResolvedValue(0);
      (productRepository.getList as jest.Mock).mockResolvedValue([]);

      // 호출
      const result = await productService.getProducts({ query: {} } as any);

      // 검증
      expect(result).toEqual({
        totalCount: 0,
        products: [],
        hasMore: false,
      });
    });
  });

  describe("getProduct", () => {
    test("상품 상제조회", async () => {
      (productRepository.getById as jest.Mock).mockResolvedValue(product);
      (productRepository.existingLike as jest.Mock).mockResolvedValue(product);

      const result = await productService.getProduct("1", "1");

      expect(result).toEqual({
        product: product,
        existingLike: product,
      });
    });

    test("상품 조회 실패 - product가 null을 반환한 경우", async () => {
      (productRepository.getById as jest.Mock).mockResolvedValue(null);

      await expect(productService.getProduct("1", "1")).rejects.toThrow(
        "상품을 찾지 못했습니다."
      );
    });

    test("상품 조회 실패 - DB 에러발생", async () => {
      (productRepository.getById as jest.Mock).mockRejectedValue(
        new Error("internal server error")
      );

      await expect(productService.getProduct("1", "1")).rejects.toThrow(
        "internal server error"
      );
    });
  });

  describe("create products", () => {
    test("상품 생성", async () => {
      (productRepository.create as jest.Mock).mockResolvedValue(product);

      const result = await productService.createProduct(mockData);

      expect(result).toEqual(product);
    });

    test("상품 생성 실패 - create가 null을 반환할 경우", async () => {
      (productRepository.create as jest.Mock).mockResolvedValue(null);

      await expect(productService.createProduct(mockData)).rejects.toThrow(
        "상품을 찾지 못했습니다."
      );
    });

    test("상품 생성 실패 - create 함수가 에러를 던질 경우", async () => {
      (productRepository.create as jest.Mock).mockRejectedValue(
        new Error("internal server error")
      );

      await expect(productService.createProduct(mockData)).rejects.toThrow(
        "internal server error"
      );
    });
  });

  describe("update product", () => {
    test("상품 수정", async () => {
      (productRepository.update as jest.Mock).mockResolvedValue({
        ...product,
        price: 30000,
      });

      const result = await productService.updateProduct("id", {
        ...product,
        price: 30000,
      });

      expect(result).toEqual({ ...product, price: 30000 });
    });

    test("상품 수정 싪패 - product가 null인 경우", async () => {
      (productRepository.update as jest.Mock).mockResolvedValue(null);

      await expect(productService.updateProduct("1", product)).rejects.toThrow(
        "상품을 찾지 못했습니다."
      );
    });

    test("상품 수정 실해 - DB 에러 발생", async () => {
      (productRepository.update as jest.Mock).mockRejectedValue(
        new Error("internal server error")
      );

      await expect(productService.updateProduct("1", product)).rejects.toThrow(
        "internal server error"
      );
    });
  });

  describe("like product", () => {
    test("상품 좋아요", async () => {
      (productRepository.likeProduct as jest.Mock).mockResolvedValue(product);

      const result = await productService.likeProduct("1", "1");

      expect(result).toEqual(product);
    });

    test("상품 좋아요 실패 - DB 에러 발생", async () => {
      (productRepository.likeProduct as jest.Mock).mockRejectedValue(
        new Error("internal server error")
      );

      await expect(productService.likeProduct("1", "1")).rejects.toThrow(
        "internal server error"
      );
    });
  });

  describe("unlike product", () => {
    test("상품 좋아요 취소", async () => {
      (productRepository.unlikeProduct as jest.Mock).mockResolvedValue(product);

      await expect(productService.unlikeProduct("1", "1")).resolves.toEqual(
        product
      );
    });

    test("상품 좋아요 취소 실패 - DB 에러 발생", async () => {
      (productRepository.likeProduct as jest.Mock).mockRejectedValue(
        new Error("internal server error")
      );

      await expect(productService.likeProduct("1", "1")).rejects.toThrow(
        "internal server error"
      );
    });
  });

  describe("delete product", () => {
    test("상품 삭제", async () => {
      (productRepository.deleteItem as jest.Mock).mockResolvedValue(product);

      await expect(productService.deleteProduct("1")).resolves.toEqual(product);
    });

    test("상품 삭제 실패 - DB 에러 발생", async () => {
      (productRepository.deleteItem as jest.Mock).mockRejectedValue(
        new Error("internal server error")
      );

      await expect(productService.deleteProduct("1")).rejects.toThrow(
        "internal server error"
      );
    });
  });
});
