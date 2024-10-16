import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import {
  getComments,
  postComment,
  deleteComment,
  patchComment,
} from "../controllers/commentController.js";

const router = express.Router();

// 상품(Product) 관련 경로
router.get("/product/:productId/comments", getComments); // /product/3/comments
router.post("/product/:productId/comments", authenticateToken, postComment);
router.delete("comments/:commentId", authenticateToken, deleteComment);
router.patch("comments/:commentId", authenticateToken, patchComment);

// 게시글(Article) 관련 경로
router.get("/article/:articleId/comments", getComments); // /article/3/comments
router.post("/article/:articleId/comments", authenticateToken, postComment);
router.delete("/comments/:commentId", authenticateToken, deleteComment);
router.patch("/comments/:commentId", authenticateToken, patchComment);

export default router;
