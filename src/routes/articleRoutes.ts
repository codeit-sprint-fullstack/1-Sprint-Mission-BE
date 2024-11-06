import express, { Request, Response, NextFunction } from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

// 게시글 생성 - 로그인한 사용자만 가능
router.post("/", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  createArticle(req, res, next);
});

// 모든 게시글 목록 조회
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  getArticles(req, res, next);
});

// 특정 게시글 조회
router.get("/:articleId", (req: Request, res: Response, next: NextFunction) => {
  getArticleById(req, res, next);
});

// 게시글 수정 - 로그인한 사용자만 가능
router.patch("/:articleId", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateArticle(req, res, next);
});

// 게시글 삭제 - 로그인한 사용자만 가능
router.delete("/:articleId", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  deleteArticle(req, res, next);
});

export default router;
