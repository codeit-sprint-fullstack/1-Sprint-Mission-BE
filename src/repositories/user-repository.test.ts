import prisma from "../repositories/prisma";
import userRepository from "../repositories/user-repository";

jest.mock("../repositories/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe("User Repository", () => {
  describe("createData", () => {
    it("createData success", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        nickname: "tester",
        name: "유재석",
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const userData = {
        data: {
          email: "test@example.com",
          encryptedPassword: "hashedPassword123",
          nickname: "tester",
          name: "유재석",
        },
        select: { id: true, email: true },
      };

      const result = await userRepository.createData(userData);

      expect(prisma.user.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(mockUser);
    });
  });

  describe("findUniqueData", () => {
    it("findUniqueData success", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        encryptedPassword: "hashedPassword123",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const query = {
        where: { email: "test@example.com" },
        select: { id: true, email: true, encryptedPassword: true },
      };

      const result = await userRepository.findUniqueData(query);

      expect(prisma.user.findUnique).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockUser);
    });
  });
});
