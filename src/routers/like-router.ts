import express from "express";
import { attachUserId, verifyAccessToken } from "../middlewares/authorization";
import validateData from "../middlewares/validate-data";
import likeController from "../controllers/like-controller";

const articleLikeRouter = express.Router();
const productLikeRouter = express.Router();

articleLikeRouter
  .route("/:id/like")
  .post(
    verifyAccessToken,
    validateData.like("article"),
    attachUserId,
    likeController.createArticleLike
  );
