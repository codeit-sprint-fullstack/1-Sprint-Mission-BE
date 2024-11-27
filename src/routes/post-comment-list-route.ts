import express, { Router } from "express";

import { validationHandler } from "../middlewares/error";
import { validateAuthorization } from "../middlewares/validator-auth-input";
import { validateGetPosttCommentList } from "../middlewares/validator-post-comment-input";

import { validateListQuery } from "../middlewares/validator-query-input";
import { validateToken } from "../middlewares/token";
import postCommentController from "../controllers/post-comment-controller";

const postCommentListRouter: Router = express.Router();

postCommentListRouter.get(
  "/:postId/comments",
  validateAuthorization,
  validateGetPosttCommentList,
  validateListQuery,
  validationHandler,
  validateToken,
  postCommentController.getPostCommentList
);

export default postCommentListRouter;
