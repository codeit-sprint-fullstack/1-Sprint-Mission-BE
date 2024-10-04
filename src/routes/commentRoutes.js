import express from "express";
import commentController from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/products/:productId/comments",
  authMiddleware,
  commentController.createProductComment
);
router.get(
  "/products/:productId/comments",
  commentController.getProductComments
);
router.post(
  "/articles/:articleId/comments",
  authMiddleware,
  commentController.createArticleComment
);
router.get(
  "/articles/:articleId/comments",
  commentController.getArticleComments
);
router.patch(
  "/comments/:commentId",
  authMiddleware,
  commentController.updateComment
);
router.delete(
  "/comments/:commentId",
  authMiddleware,
  commentController.deleteComment
);

export default router;
