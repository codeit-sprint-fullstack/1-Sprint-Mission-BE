import { body, param, ValidationChain } from "express-validator";

import { productCommentSchema } from "../constants/product-comment";

import {
  EMPTY_ERROR_MESSAGES,
  LENGTH_ERROR_MESSAGES,
  PATTERN_ERROR_MESSAGES,
} from "../constants/error";

const validateBodyProductCommentContent: ValidationChain = body("content")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["productCommentContent"])
  .bail()
  .isLength({
    min: productCommentSchema.MIN_LENGTH_CONTENT,
    max: productCommentSchema.MAX_LENGTH_CONTENT,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["productCommentContent"]);

const validateParamProductCommentProductId: ValidationChain = param("productId")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["productId"])
  .bail()
  .isUUID()
  .withMessage(PATTERN_ERROR_MESSAGES["productId"]);

export const validateParamProductCommentProductCommentId: ValidationChain =
  param("productCommentId")
    .notEmpty()
    .withMessage(EMPTY_ERROR_MESSAGES["productCommentId"])
    .bail()
    .isUUID()
    .withMessage(PATTERN_ERROR_MESSAGES["productCommentId"]);

const validateBodyProductCommentProductId: ValidationChain = body("productId")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["productId"])
  .bail()
  .isUUID()
  .withMessage(PATTERN_ERROR_MESSAGES["productId"]);

export const validateCreateProductComment: ValidationChain[] = [
  validateBodyProductCommentContent,
  validateBodyProductCommentProductId,
];

export const validateGetProductCommentList: ValidationChain[] = [
  validateParamProductCommentProductId,
];

export const validateUpdateProductComment: ValidationChain[] = [
  validateParamProductCommentProductCommentId,
  validateBodyProductCommentContent,
];
