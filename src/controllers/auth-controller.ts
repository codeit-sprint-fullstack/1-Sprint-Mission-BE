import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";

import authService from "../services/auth-service";
import { CustomError } from "../utils/error";

import {
  UserSignInData,
  UserSignUpData,
  UserTokenInfo,
} from "../types/user-types";

async function signUp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, nickname, name }: UserSignUpData = req.body;
    const authInfo: User | null = await authService.signUp({
      email,
      password,
      nickname,
      name,
    });

    if (authInfo === null) {
      throw new CustomError(50010);
    }

    res.status(201).send(authInfo);
  } catch (err) {
    next(err);
  }
}

async function signIn(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password }: UserSignInData = req.body;
    const authInfo: UserTokenInfo | null | boolean = await authService.signIn({
      email,
      password,
    });

    if (authInfo === null) {
      throw new CustomError(40030);
    }

    if (authInfo === false) {
      throw new CustomError(40031);
    }

    res.status(200).send(authInfo);
  } catch (err) {
    next(err);
  }
}

async function refreshAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { RefreshToken }: { RefreshToken: string } = req.body;
    const newAccessToken: string | Error = await authService.refreshAccessToken(
      RefreshToken
    );

    res.status(200).send({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
}

export default { signUp, signIn, refreshAccessToken };
