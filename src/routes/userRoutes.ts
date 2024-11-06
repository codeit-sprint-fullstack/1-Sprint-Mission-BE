import express, { Request, Response, NextFunction } from "express";
import {
  getCurrentUser,
  updateUser,
  updatePassword,
  getUserProducts,
  getUserFavorites,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

// 현재 유저 정보 조회 - 로그인한 사용자만 가능
router.get("/me", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getCurrentUser(req, res, next);
});

// 유저 정보 업데이트 - 로그인한 사용자만 가능
router.patch("/me", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateUser(req, res, next);
});

// 비밀번호 변경 - 로그인한 사용자만 가능
router.patch("/me/password", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updatePassword(req, res, next);
});

// 유저의 상품 목록 조회 - 로그인한 사용자만 가능
router.get("/me/products", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getUserProducts(req, res, next);
});

// 유저의 좋아요 상품 목록 조회 - 로그인한 사용자만 가능
router.get("/me/favorites", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getUserFavorites(req, res, next);
});

export default router;
