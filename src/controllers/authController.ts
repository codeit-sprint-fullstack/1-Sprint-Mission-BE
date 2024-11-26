import * as authService from "../services/authService";
import { Request, Response, NextFunction } from "express";

interface User {
  id: number;
  email: string;
  nickname: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const sendAuthResponse = (
  res: Response,
  status: number,
  message: string,
  user?: User,
  tokens?: Tokens
) => {
  if (!user || !tokens) {
    return res.status(400).json({ message: "User or tokens are required" });
  }
  res.status(status).json({
    message,
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nickname, email, password } = req.body;
    const { newUser, tokens } = await authService.createUser(
      nickname,
      email,
      password
    );
    sendAuthResponse(
      res,
      201,
      "User created successfully",
      {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
      },
      tokens
    );
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.getUserByEmail(email, password);
    sendAuthResponse(res, 200, "로그인 성공", user, tokens);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body as { refreshToken: string };
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    } = await authService.refreshToken(refreshToken);
    sendAuthResponse(
      res,
      200,
      "리프레시 토큰이 성공적으로 갱신되었습니다.",
      user,
      { accessToken, refreshToken: newRefreshToken }
    );
  } catch (error) {
    next(error);
  }
};
