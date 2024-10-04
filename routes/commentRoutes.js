import express from "express";
import * as commentController from "../controllers/commentController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

//https://thrift-shop.onrender.com/
router.post(
  "/products/:productId/comments",
  verifyToken,
  commentController.createProductComment
);
router.get(
  "/products/:productId/comments",
  verifyToken,
  commentController.getProductComments
);
router.post(
  "/articles/:articleId/comments",
  verifyToken,
  commentController.createArticleComment
);
router.get(
  "/articles/:articleId/comments",
  verifyToken,
  commentController.getArticleComments
);
router.patch(
  "/comments/:commentId",
  verifyToken,
  commentController.updateComment
);
router.delete(
  "/comments/:commentId",
  verifyToken,
  commentController.deleteComment
);

export default router;
