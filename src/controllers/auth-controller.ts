import { NextFunction, Request, Response } from "express";
import { SingUp } from "../struct/user-struct";
import authService from "../services/auth-service";

// 회원 가입
async function singUp(
  req: Request<{}, {}, SingUp>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = authService.singUp(req.body);
    res.status(201).send(user);
  } catch (err) {
    return next(err);
  }
}

export default {
  singUp,
};
