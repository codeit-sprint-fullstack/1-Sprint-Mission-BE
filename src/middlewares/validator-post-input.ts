import { body, ValidationChain } from "express-validator";

import { postSchema } from "../constants/post";

import {
  EMPTY_ERROR_MESSAGES,
  LENGTH_ERROR_MESSAGES,
} from "../constants/error";

const validateBodyCreatePostName: ValidationChain = body("name")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["postName"])
  .bail()
  .isLength({
    min: postSchema.MIN_LENGTH_NAME,
    max: postSchema.MAX_LENGTH_NAME,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["postName"]);

const validateBodyCreatePostContent: ValidationChain = body("content")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["postContent"])
  .bail()
  .isLength({
    min: postSchema.MIN_LENGTH_CONTENT,
    max: postSchema.MAX_LENGTH_CONTENT,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["postContent"]);

const validateBodyUpdatePostName: ValidationChain = body("name")
  .optional()
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["postName"])
  .bail()
  .isLength({
    min: postSchema.MIN_LENGTH_NAME,
    max: postSchema.MAX_LENGTH_NAME,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["postName"]);

const validateBodyUpdatePostContent: ValidationChain = body("content")
  .optional()
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["postContent"])
  .bail()
  .isLength({
    min: postSchema.MIN_LENGTH_CONTENT,
    max: postSchema.MAX_LENGTH_CONTENT,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["postContent"]);

export const validateCreatePost: ValidationChain[] = [
  validateBodyCreatePostName,
  validateBodyCreatePostContent,
];

export const validateUpdatePost: ValidationChain[] = [
  validateBodyUpdatePostName,
  validateBodyUpdatePostContent,
];
