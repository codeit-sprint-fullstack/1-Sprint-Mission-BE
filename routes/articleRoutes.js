import express from "express";
import * as articleController from "../controllers/articleController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router
  .route("/")
  .post(verifyToken, articleController.createArticle)
  .get(articleController.getArticles);

router
  .route("/:articleId")
  .all(verifyToken)
  .get(articleController.getArticleById)
  .patch(articleController.updateArticle)
  .delete(articleController.deleteArticle);

router
  .route("/:articleId/like")
  .all(verifyToken)
  .post(articleController.addLike)
  .delete(articleController.deleteLike);

export default router;
