import express from "express";
import * as articleController from "../controllers/articleController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { imageUpload } from "../middlewares/imageUpload.js";
import { validateArticle } from "../middlewares/validateArticle.js";

const router = express.Router();

router
  .route("/")
  .post(
    verifyToken,
    imageUpload.array("images", 3),
    validateArticle,
    articleController.createArticle
  )
  .get(articleController.getArticles);

router
  .route("/:articleId")
  .all(verifyToken)
  .get(articleController.getArticleById)
  .patch(imageUpload.array("images", 3), articleController.updateArticle)
  .delete(articleController.deleteArticle);

router
  .route("/:articleId/like")
  .all(verifyToken)
  .post(articleController.addLike)
  .delete(articleController.deleteLike);

export default router;
