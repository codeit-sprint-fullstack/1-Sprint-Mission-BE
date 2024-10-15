import express from "express";
import * as commentController from "../controllers/commentController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router
  .route("/products/:productId/comments")
  .post(verifyToken, commentController.createProductComment)
  .get(commentController.getProductComments);

router
  .route("/articles/:articleId/comments")
  .post(verifyToken, commentController.createArticleComment)
  .get(commentController.getArticleComments);

router
  .route("/comments/:commentId")
  .all(verifyToken)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

export default router;
