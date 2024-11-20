import { NextFunction, Request, response, Response } from "express";
import { SignIn, SignUp } from "../struct/user-struct";
import authService from "../services/auth-service";
import { verifyRefreshToken } from "../utills/jwt-utill";
import { CustomError } from "../middlewares/error-handler";

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
  try {
    const { response, refreshToken } = await authService.signIn(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.send(response);
  } catch (err) {
    return next(err);
  }
}

// 토큰 재발핼
async function reissueToken(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = await authService.reissueToken(req);

    response.send({ accessToken });
  } catch (err) {
    return next(err);
  }
}

export default {
  signUp,
  signIn,
  reissueToken,
};
