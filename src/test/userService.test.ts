import * as userService from "../services/userService";
import prisma from "../models/index";

jest.mock("../models/index", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

describe("User Service", () => {
  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 Mock 초기화
  });

  describe("getUserById", () => {
    it("should return a user if the user exists", async () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "testuser@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null if the user does not exist", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userService.getUserById(999);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });
});
