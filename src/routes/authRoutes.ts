import express, { Request, Response, NextFunction } from "express";
import { signUp, signIn } from "../controllers/authController";
import validationMiddleware from "../middlewares/validationMiddleware";

const router = express.Router();

// 회원가입
router.post("/signUp", validationMiddleware, (req: Request, res: Response, next: NextFunction) => {
  signUp(req, res, next);
});

// 로그인
router.post("/signIn", validationMiddleware, (req: Request, res: Response, next: NextFunction) => {
  signIn(req, res, next);
});

export default router;
