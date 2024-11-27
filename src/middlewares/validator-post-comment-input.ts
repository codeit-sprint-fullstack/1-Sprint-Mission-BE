import { body, param, ValidationChain } from "express-validator";

import { postCommentSchema } from "../constants/post-comment";

import {
  EMPTY_ERROR_MESSAGES,
  LENGTH_ERROR_MESSAGES,
  PATTERN_ERROR_MESSAGES,
} from "../constants/error";

const validateBodyPostCommentContent: ValidationChain = body("content")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["postCommentContent"])
  .bail()
  .isLength({
    min: postCommentSchema.MIN_LENGTH_CONTENT,
    max: postCommentSchema.MAX_LENGTH_CONTENT,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["postCommentContent"]);

const validateParamPostCommentPostId: ValidationChain = param("postId")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["postId"])
  .bail()
  .isUUID()
  .withMessage(PATTERN_ERROR_MESSAGES["postId"]);

export const validateParamPostCommentPostCommentId: ValidationChain = param(
  "postCommentId"
)
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["postCommentId"])
  .bail()
  .isUUID()
  .withMessage(PATTERN_ERROR_MESSAGES["postCommentId"]);

const validateBodyPostCommentPostId: ValidationChain = body("postId")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["postId"])
  .bail()
  .isUUID()
  .withMessage(PATTERN_ERROR_MESSAGES["postId"]);

export const validateCreatePostComment: ValidationChain[] = [
  validateBodyPostCommentContent,
  validateBodyPostCommentPostId,
];

export const validateGetPosttCommentList: ValidationChain[] = [
  validateParamPostCommentPostId,
];

export const validateUpdatePostComment: ValidationChain[] = [
  validateParamPostCommentPostCommentId,
  validateBodyPostCommentContent,
];
