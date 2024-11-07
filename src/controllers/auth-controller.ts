import { NextFunction, Request, Response } from "express";
import { SignIn, SignUp } from "../struct/user-struct";
import authService from "../services/auth-service";

// 회원가입
async function signUp(
  req: Request<{}, {}, SignUp>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = authService.signUp(req.body);
    res.status(201).send(user);
  } catch (err) {
    return next(err);
  }
}

// 로그인
async function signIn(
  req: Request<{}, {}, SignIn>,
  res: Response,
  next: NextFunction
) {
  const { response, refreshToken } = await authService.signIn(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.send(response);
}

export default {
  signUp,
  signIn,
};
