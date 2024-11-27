import express, { Router } from "express";

import { validationHandler } from "../middlewares/error";
import { validateAuthorization } from "../middlewares/validator-auth-input";
import {
  validateCreatePost,
  validateUpdatePost,
} from "../middlewares/validator-post-input";
import { validateListQuery } from "../middlewares/validator-query-input";
import { isAuthorizedPostIdParam } from "../middlewares/post";
import { validateToken, checkToken } from "../middlewares/token";
import postController from "../controllers/post-controller";
import postCommentController from "../controllers/post-comment-controller";

const postRouter: Router = express.Router();

postRouter
  .post(
    "/",
    validateAuthorization,
    validateCreatePost,
    validationHandler,
    validateToken,
    postController.createPost
  )
  .get(
    "/",
    validateListQuery,
    validationHandler,
    checkToken,
    postController.getPostList
  )
  .get(
    "/:postId",
    validateAuthorization,
    validationHandler,
    validateToken,
    postController.getPost
  )
  .get(
    "/:postId/comments",
    validateListQuery,
    validationHandler,
    postCommentController.getPostCommentList
  )
  .patch(
    "/:postId",
    validateAuthorization,
    validateUpdatePost,
    validationHandler,
    validateToken,
    isAuthorizedPostIdParam,
    postController.modifyPost
  )
  .delete(
    "/:postId",
    validateAuthorization,
    validationHandler,
    validateToken,
    isAuthorizedPostIdParam,
    postController.deletePost
  )
  .patch(
    "/:postId/favorite",
    validateAuthorization,
    validationHandler,
    validateToken,
    isAuthorizedPostIdParam,
    postController.increasePostFavorite
  )
  .delete(
    "/:postId/favorite",
    validateAuthorization,
    validationHandler,
    validateToken,
    postController.decreasePostFavorite
  );

export default postRouter;
