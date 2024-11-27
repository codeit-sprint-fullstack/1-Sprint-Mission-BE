import express, { Router } from "express";

import { validationHandler } from "../middlewares/error";
import { validateAuthorization } from "../middlewares/validator-auth-input";
import {
  validateCreatePostComment,
  validateUpdatePostComment,
  validateParamPostCommentPostCommentId,
} from "../middlewares/validator-post-comment-input";

import { isAuthorizedPostCommentIdParam } from "../middlewares/post-comment";
import { validateToken } from "../middlewares/token";
import postCommentController from "../controllers/post-comment-controller";

const postCommentRouter: Router = express.Router();

postCommentRouter
  .post(
    "/",
    validateAuthorization,
    validateCreatePostComment,
    validationHandler,
    validateToken,
    postCommentController.createPostComment
  )
  .get(
    "/:postCommentId",
    validateParamPostCommentPostCommentId,
    validationHandler,
    postCommentController.getPostComment
  )
  .patch(
    "/:postCommentId",
    validateAuthorization,
    validateParamPostCommentPostCommentId,
    validateUpdatePostComment,
    validationHandler,
    validateToken,
    isAuthorizedPostCommentIdParam,
    postCommentController.modifyPostComment
  )
  .delete(
    "/:postCommentId",
    validateAuthorization,
    validateParamPostCommentPostCommentId,
    validationHandler,
    validateToken,
    isAuthorizedPostCommentIdParam,
    postCommentController.deletePostComment
  );

export default postCommentRouter;
