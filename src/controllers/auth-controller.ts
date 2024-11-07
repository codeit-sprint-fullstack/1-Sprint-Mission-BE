import { NextFunction, Request, Response } from "express";
import { SignUp } from "../struct/user-struct";
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

export default {
  signUp,
};
