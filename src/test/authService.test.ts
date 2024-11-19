import * as authService from "../services/authService";
import prisma from "../models/index"; // Prisma 클라이언트
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../models/index", () => ({
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  auth: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Service", () => {
  const originalError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a new user and return tokens", async () => {
      const mockUser = {
        id: 1,
        nickname: "TestUser",
        email: "test@example.com",
        encryptedPassword: "hashedPassword",
      };

      const mockTokens = {
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
        accessTokenExp: new Date(),
        refreshTokenExp: new Date(),
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (prisma.auth.create as jest.Mock).mockResolvedValue(mockTokens);
      (jwt.sign as jest.Mock).mockImplementation((payload, secret, options) =>
        options?.expiresIn === "3h" ? "mockAccessToken" : "mockRefreshToken"
      );

      const result = await authService.createUser(
        "TestUser",
        "test@example.com",
        "password123"
      );

      expect(result.newUser).toEqual(mockUser);
      expect(result.tokens.accessToken).toBe("mockAccessToken");
      expect(result.tokens.refreshToken).toBe("mockRefreshToken");
    });

    it("should throw an error if user already exists", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(
        authService.createUser("TestUser", "test@example.com", "password123")
      ).rejects.toThrow("이메일 또는 닉네임이 이미 사용중입니다.");
    });
  });

  describe("getUserByEmail", () => {
    it("should return user and tokens if email and password match", async () => {
      const mockUser = {
        id: 1,
        nickname: "TestUser",
        email: "test@example.com",
        encryptedPassword: "hashedPassword",
      };

      const mockTokens = {
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
        accessTokenExp: new Date(),
        refreshTokenExp: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (prisma.auth.create as jest.Mock).mockResolvedValue(mockTokens);
      (jwt.sign as jest.Mock).mockImplementation((payload, secret, options) =>
        options?.expiresIn === "3h" ? "mockAccessToken" : "mockRefreshToken"
      );

      const result = await authService.getUserByEmail(
        "test@example.com",
        "password123"
      );

      expect(result.user).toEqual(mockUser);
      expect(result.tokens.accessToken).toBe("mockAccessToken");
      expect(result.tokens.refreshToken).toBe("mockRefreshToken");
    });

    it("should throw an error if email or password is incorrect", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.getUserByEmail("test@example.com", "password123")
      ).rejects.toThrow("이메일과 비밀번호를 다시 확인해주세요");
    });
  });

  describe("refreshToken", () => {
    it("should refresh tokens if the refresh token is valid", async () => {
      const mockUser = {
        id: 1,
        nickname: "TestUser",
        email: "test@example.com",
      };

      const mockAuth = {
        refreshToken: "validRefreshToken",
        userId: 1,
      };

      (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
      (prisma.auth.findUnique as jest.Mock).mockResolvedValue(mockAuth);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockImplementation((payload, secret, options) =>
        options?.expiresIn === "3h" ? "newAccessToken" : "newRefreshToken"
      );

      const result = await authService.refreshToken("validRefreshToken");

      expect(result.accessToken).toBe("newAccessToken");
      expect(result.refreshToken).toBe("validRefreshToken");
      expect(result.user).toEqual(mockUser);
    });

    it("should throw an error if the refresh token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid refresh token");
      });

      await expect(
        authService.refreshToken("invalidRefreshToken")
      ).rejects.toThrow("Invalid or expired refresh token");
    });
  });
});
