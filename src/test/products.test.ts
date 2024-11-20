import productService from "../services/productService";
import productRepository from "../repositorys/productRepository";

jest.mock("../repositorys/productRepository");

describe("Product Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    test("should return products and metadata", async () => {
      // Mock 데이터
      const mockProducts = [
        {
          id: 1,
          name: "Product 1",
          description: "Description 1",
          owner: { nickname: "Owner 1" },
        },
        {
          id: 2,
          name: "Product 2",
          description: "Description 2",
          owner: { nickname: "Owner 2" },
        },
      ];

      // Mock repository 함수
      (productRepository.getTotalCount as jest.Mock).mockResolvedValue(20);
      (productRepository.getList as jest.Mock).mockResolvedValue(mockProducts);

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
        products: mockProducts,
        hasMore: true,
      });
    });

    test("should handle search keywords", async () => {
      // Mock 데이터
      const mockProducts = [
        {
          id: 1,
          name: "Product 1",
          description: "Keyword Matched",
          owner: { nickname: "Owner 1" },
        },
      ];

      // Mock repository 함수
      (productRepository.getTotalCount as jest.Mock).mockResolvedValue(5);
      (productRepository.getList as jest.Mock).mockResolvedValue(mockProducts);

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
        products: mockProducts,
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
      (productRepository.getById as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Product 1",
        description: "Description 1",
        owner: { nickname: "Owner 1" },
      });
      (productRepository.existingLike as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Product 1",
        description: "Description 1",
        owner: { nickname: "Owner 1" },
      });

      const result = await productService.getProduct("1", "1");

      expect(result).toEqual({
        product: {
          id: 1,
          name: "Product 1",
          description: "Description 1",
          owner: { nickname: "Owner 1" },
        },
        existingLike: {
          id: 1,
          name: "Product 1",
          description: "Description 1",
          owner: { nickname: "Owner 1" },
        },
      });
    });
  });
});
