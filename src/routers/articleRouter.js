import express from "express";
import validateUuid from "../middlewares/validateUuid.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/articleController.js";

const router = express.Router();

router.use("/:articleId", validateUuid);

router.get("/", asyncHandler(controller.getArticleList));
router.get("/:articleId", asyncHandler(controller.getArticleById));
router.post("/", asyncHandler(controller.createArticle));
router.patch("/:articleId", asyncHandler(controller.updateArticleById));
router.delete("/:articleId", asyncHandler(controller.deleteArticleById));

router.post("/:articleId/like", asyncHandler(controller.createLikeOnArticle));
router.delete("/:articleId/like", asyncHandler(controller.deleteLikeOnArticle));

export default router;
