import { Request, Response, NextFunction } from "express";
import authController from "./auth-controller";
import authService from "../services/auth-service";
import { CustomError } from "../utils/error";
import { User } from "@prisma/client";

interface UserIndetificationInfo {
  id: string;
  nickname: string;
  name: string;
  email: string;
  createdAt: Date;
  accessToken: string;
  refreshToken: string;
}

jest.mock("../services/auth-service");

describe("Auth Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("signUp", () => {
    test("sign-in success : status(201)", async () => {
      const mockUser: Partial<User> = {
        id: "uuid-user-123",
        email: "test@example.com",
        nickname: "tester",
        name: "유재석",
        image: null,
        createdAt: new Date(),
      };

      mockReq.body = {
        email: "test@example.com",
        password: "password",
        nickname: "tester",
        name: "유재석",
      };
      (authService.signUp as jest.Mock).mockResolvedValue(mockUser);

      await authController.signUp(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(authService.signUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
        nickname: "tester",
        name: "유재석",
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith(mockUser);
    });

    test("sign-in fail(overlapping email) : throw CustomError", async () => {
      mockReq.body = {
        email: "test@example.com",
        password: "password",
        nickname: "tester",
        name: "유재석",
      };
      (authService.signUp as jest.Mock).mockResolvedValue(null);

      await authController.signUp(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(authService.signUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
        nickname: "tester",
        name: "유재석",
      });
      expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    });
  });

  describe("signIn", () => {
    test("sign-in success : status(200)", async () => {
      const mockTokenInfo: UserIndetificationInfo = {
        id: "uuid-user-123",
        nickname: "tester",
        name: "유재석",
        email: "test@example.com",
        createdAt: new Date(),
        accessToken: "accessToken123",
        refreshToken: "refreshToken123",
      };

      mockReq.body = {
        email: "test@example.com",
        password: "password",
      };
      (authService.signIn as jest.Mock).mockResolvedValue(mockTokenInfo);

      await authController.signIn(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(authService.signIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockTokenInfo);
    });

    test("sign-in fail(unsigned up email) : throw CustomError", async () => {
      mockReq.body = {
        email: "test@example.com",
        password: "password",
      };
      (authService.signIn as jest.Mock).mockResolvedValue(null);

      await authController.signIn(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(authService.signIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
      expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    });

    test("sign-in fail(incorrect password) : throw CustomError", async () => {
      mockReq.body = {
        email: "test@example.com",
        password: "password_",
      };
      (authService.signIn as jest.Mock).mockResolvedValue(false);

      await authController.signIn(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(authService.signIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password_",
      });
      expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    });
  });
});
