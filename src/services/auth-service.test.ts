// async function signIn({
//     email,
//     password,
//   }: UserSignInData): Promise<UserTokenInfo | null | boolean> {}

//   async function refreshAccessToken(
//     RefreshToken: string
//   ): Promise<string | Error> {}

import authService from "../services/auth-service";
import prisma from "../repositories/prisma";
import userRepository from "../repositories/user-repository";
import { hashPassword, verifyPassword } from "../utils/password";
import { createAccessToken, createRefreshToken } from "../utils/token";
import { userIndetificationInfoMapper } from "../services/mappers/user-mapper";
import {
  userBaseSelect,
  userIdentificationSelect,
} from "../services/selectors/user-select";

jest.mock("../repositories/prisma", () => ({
  __esModule: true,
  default: { $transaction: jest.fn() },
}));
jest.mock("../repositories/user-repository");
jest.mock("../utils/password");
jest.mock("../utils/token");
jest.mock("../services/mappers/user-mapper");

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("signUp success", async () => {
      const mockUser = {
        id: "uuid-user-123",
        email: "test@example.com",
        nickname: "tester",
        name: "유재석",
        image: null,
        createdAt: new Date(),
      };

      const mockData = {
        email: "test@example.com",
        password: "password123",
        nickname: "tester",
        name: "유재석",
      };

      (hashPassword as jest.Mock).mockResolvedValue("hashedPassword123");
      (userRepository.createData as jest.Mock).mockResolvedValue(mockUser);
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => cb());

      const result = await authService.signUp(mockData);

      expect(hashPassword).toHaveBeenCalledWith(mockData.password);
      expect(userRepository.createData).toHaveBeenCalledWith({
        data: {
          email: mockData.email,
          encryptedPassword: "hashedPassword123",
          nickname: mockData.nickname,
          name: mockData.name,
        },
        select: userBaseSelect,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("signIn", () => {
    it("signIn success", async () => {
      const mockUser = {
        id: "uuid-user-123",
        email: "test@example.com",
        nickname: "tester",
        name: "유재석",
        image: null,
        createdAt: new Date(),
        encryptedPassword: "hashedPassword123",
      };

      const mockTokenInfo = {
        userInfo: mockUser,
        accessToken: "accessToken123",
        refreshToken: "refreshToken123",
      };

      const mockData = {
        email: "test@example.com",
        password: "password123",
      };

      (userRepository.findUniqueData as jest.Mock).mockResolvedValue(mockUser);
      (verifyPassword as jest.Mock).mockResolvedValue(true);
      (createAccessToken as jest.Mock).mockReturnValue("accessToken123");
      (createRefreshToken as jest.Mock).mockReturnValue("refreshToken123");
      (userIndetificationInfoMapper as jest.Mock).mockReturnValue(
        mockTokenInfo
      );
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => cb());

      const result = await authService.signIn(mockData);

      expect(userRepository.findUniqueData).toHaveBeenCalledWith({
        where: { email: mockData.email },
        select: userIdentificationSelect,
      });
      expect(verifyPassword).toHaveBeenCalledWith({
        hashedPassword: mockUser.encryptedPassword,
        plainPassword: mockData.password,
      });
      expect(createAccessToken).toHaveBeenCalledWith(mockUser.id);
      expect(createRefreshToken).toHaveBeenCalledWith(mockUser.id);
      expect(userIndetificationInfoMapper).toHaveBeenCalledWith({
        userInfo: mockUser,
        accessToken: "accessToken123",
        refreshToken: "refreshToken123",
      });
      expect(result).toEqual(mockTokenInfo);
    });

    it("signIn fail : unsigned in email", async () => {
      (userRepository.findUniqueData as jest.Mock).mockResolvedValue(null);
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => cb());

      const result = await authService.signIn({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(result).toBeNull();
    });

    it("signIn fail : incorrect password", async () => {
      const mockUser = {
        id: "uuid-user-123",
        email: "test@example.com",
        nickname: "tester",
        name: "유재석",
        encryptedPassword: "hashedPassword123",
      };

      (userRepository.findUniqueData as jest.Mock).mockResolvedValue(mockUser);
      (verifyPassword as jest.Mock).mockResolvedValue(false);
      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => cb());

      const result = await authService.signIn({
        email: "test@example.com",
        password: "password456",
      });

      expect(verifyPassword).toHaveBeenCalledWith({
        hashedPassword: mockUser.encryptedPassword,
        plainPassword: "password456",
      });
      expect(result).toBe(false);
    });
  });
});
