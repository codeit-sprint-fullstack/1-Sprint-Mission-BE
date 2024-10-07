import express from "express";
import validateUuid from "../middlewares/validateUuid.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/articleController.js";
import { articleAuthorization, authentication } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", asyncHandler(controller.getArticleList));
router.get(
  "/:articleId",
  validateUuid,
  authentication,
  asyncHandler(controller.getArticleById)
);
router.post("/", authentication, asyncHandler(controller.createArticle));

router.patch(
  "/:articleId",
  validateUuid,
  authentication,
  articleAuthorization,
  asyncHandler(controller.updateArticleById)
);
router.delete(
  "/:articleId",
  validateUuid,
  authentication,
  articleAuthorization,
  asyncHandler(controller.deleteArticleById)
);

router.post(
  "/:articleId/like",
  validateUuid,
  authentication,
  asyncHandler(controller.createLikeOnArticle)
);
router.delete(
  "/:articleId/like",
  validateUuid,
  authentication,
  asyncHandler(controller.deleteLikeOnArticle)
);

export default router;
