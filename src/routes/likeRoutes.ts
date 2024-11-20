import express, { Request, Response, NextFunction } from "express";
import {
  likeProduct,
  unlikeProduct,
  likeArticle,
  unlikeArticle,
} from "../controllers/likeController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

// 상품 좋아요 - 로그인한 사용자만 가능
router.post("/products/:productId/like", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  likeProduct(req, res, next);
});

// 상품 좋아요 취소 - 로그인한 사용자만 가능
router.delete("/products/:productId/like", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  unlikeProduct(req, res, next);
});

// 게시글 좋아요 - 로그인한 사용자만 가능
router.post("/articles/:articleId/like", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  likeArticle(req, res, next);
});

// 게시글 좋아요 취소 - 로그인한 사용자만 가능
router.delete("/articles/:articleId/like", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  unlikeArticle(req, res, next);
});

export default router;
