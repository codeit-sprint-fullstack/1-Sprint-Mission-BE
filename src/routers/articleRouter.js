import express from "express";
import validateUuid from "../middlewares/validateUuid.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/articleController.js";
import { authentication } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", asyncHandler(controller.getArticleList));
router.get(
  "/:articleId",
  validateUuid,
  asyncHandler(controller.getArticleById)
);
router.post("/", authentication, asyncHandler(controller.createArticle));
router.patch(
  "/:articleId",
  validateUuid,
  asyncHandler(controller.updateArticleById)
);
router.delete(
  "/:articleId",
  validateUuid,
  asyncHandler(controller.deleteArticleById)
);

router.post(
  "/:articleId/like",
  validateUuid,
  asyncHandler(controller.createLikeOnArticle)
);
router.delete(
  "/:articleId/like",
  validateUuid,
  asyncHandler(controller.deleteLikeOnArticle)
);

export default router;
