import express, { Request, Response, NextFunction } from "express";
import {
  createProductComment,
  createArticleComment,
  updateProductComment,
  updateArticleComment,
  deleteProductComment,
  deleteArticleComment,
  getProductComments,
  getArticleComments,
} from "../controllers/commentController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

// 상품에 대한 댓글 생성 - 로그인한 사용자만 가능
router.post("/products/:productId/comments", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  createProductComment(req, res, next);
});

// 게시글에 대한 댓글 생성 - 로그인한 사용자만 가능
router.post("/articles/:articleId/comments", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  createArticleComment(req, res, next);
});

// 상품에 대한 댓글 조회
router.get("/products/:productId/comments", (req: Request, res: Response, next: NextFunction) => {
  getProductComments(req, res, next);
});

// 게시글 댓글 목록 조회
router.get("/articles/:articleId/comments", (req: Request, res: Response, next: NextFunction) => {
  getArticleComments(req, res, next);
});

// 상품 댓글 수정 - 로그인한 사용자만 가능
router.patch("/products/:productId/comments/:id", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateProductComment(req, res, next);
});

// 게시글 댓글 수정 - 로그인한 사용자만 가능
router.patch("/articles/:articleId/comments/:id", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateArticleComment(req, res, next);
});

// 상품 댓글 삭제 - 로그인한 사용자만 가능
router.delete("/products/:productId/comments/:id", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  deleteProductComment(req, res, next);
});

// 게시글 댓글 삭제 - 로그인한 사용자만 가능
router.delete("/articles/:articleId/comments/:id", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  deleteArticleComment(req, res, next);
});

export default router;
