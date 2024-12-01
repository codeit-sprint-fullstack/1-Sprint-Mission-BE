import prisma from "./prisma";
import productImageRepository from "./product-image-repository";

jest.mock("./prisma", () => ({
  __esModule: true,
  default: {
    productImage: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

describe("ProductImage Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createManyData", () => {
    it("createManyData success", async () => {
      const mockData = [
        {
          image: "https://example.com/image1.svg",
          productId: "uuid-product-123",
        },
        {
          image: "https://example.com/image2.svg",
          productId: "uuid-product-456",
        },
      ];

      const mockResponse = { count: 2 };

      (prisma.productImage.createMany as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const result = await productImageRepository.createManyData(mockData);

      expect(prisma.productImage.createMany).toHaveBeenCalledWith({
        data: mockData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteManyData", () => {
    it("deleteManyData success", async () => {
      const mockWhere = { productId: "uuid-product-123" };

      (prisma.productImage.deleteMany as jest.Mock).mockResolvedValue(
        undefined
      );

      await productImageRepository.deleteManyData(mockWhere);

      expect(prisma.productImage.deleteMany).toHaveBeenCalledWith({
        where: mockWhere,
      });
    });
  });
});
