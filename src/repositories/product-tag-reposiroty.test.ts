import prisma from "./prisma";
import productTagRepository from "./product-tag-repository";

jest.mock("./prisma", () => ({
  __esModule: true,
  default: {
    productTag: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

describe("ProductTag Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createManyData", () => {
    it("createManyData success", async () => {
      const mockData = [
        { tag: "Tag1", productId: "1" },
        { tag: "Tag2", productId: "2" },
      ];

      const mockResponse = { count: 2 };

      (prisma.productTag.createMany as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const result = await productTagRepository.createManyData(mockData);

      expect(prisma.productTag.createMany).toHaveBeenCalledWith({
        data: mockData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteManyData", () => {
    it("deleteManyData success", async () => {
      const mockWhere = { productId: "1" };

      (prisma.productTag.deleteMany as jest.Mock).mockResolvedValue(undefined);

      await productTagRepository.deleteManyData(mockWhere);

      expect(prisma.productTag.deleteMany).toHaveBeenCalledWith({
        where: mockWhere,
      });
    });
  });
});
