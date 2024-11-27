import { body, ValidationChain } from "express-validator";

import { productSchema } from "../constants/product";
import {
  imageSchema,
  MIN_NUMBER_IMAGES,
  MAX_NUMBER_IMAGES,
} from "../constants/image";
import { tagSchema, MIN_NUMBER_TAGS, MAX_NUMBER_TAGS } from "../constants/tag";
import {
  RANGE_ERROR_MESSAGES,
  EMPTY_ERROR_MESSAGES,
  LENGTH_ERROR_MESSAGES,
} from "../constants/error";

const validateBodyProductName: ValidationChain = body("name")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["productName"])
  .bail()
  .isLength({
    min: productSchema.MIN_LENGTH_NAME,
    max: productSchema.MAX_LENGTH_NAME,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["productName"]);

const validateBodyProductDescription: ValidationChain = body("description")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["productDescription"])
  .bail()
  .isLength({
    min: productSchema.MIN_LENGTH_DESCRIPTION,
    max: productSchema.MAX_LENGTH_DESCRIPTION,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["productDescription"]);

const validateBodyPrice: ValidationChain = body("price")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["price"])
  .bail()
  .isInt({
    min: productSchema.MIN_VALUE_PRICE,
    max: productSchema.MAX_VALUE_PRICE,
  })
  .withMessage(RANGE_ERROR_MESSAGES["price"]);

const validateBodyImages: ValidationChain = body("images")
  .optional()
  .isArray({ min: MIN_NUMBER_IMAGES, max: MAX_NUMBER_IMAGES })
  .withMessage(RANGE_ERROR_MESSAGES["images"])
  .bail()
  .custom((array) => {
    return array.every(
      (value: string) =>
        typeof value === "string" &&
        imageSchema.MIN_LENGTH_IMAGE <= value.length &&
        value.length <= imageSchema.MAX_LENGTH_IMAGE
    );
  })
  .withMessage(LENGTH_ERROR_MESSAGES["image"]);

const validateBodyTags: ValidationChain = body("tags")
  .optional()
  .isArray({ min: MIN_NUMBER_TAGS, max: MAX_NUMBER_TAGS })
  .withMessage(RANGE_ERROR_MESSAGES["tags"])
  .bail()
  .custom((array) => {
    return array.every(
      (value: string) =>
        typeof value === "string" &&
        tagSchema.MIN_LENGTH_TAG <= value.length &&
        value.length <= tagSchema.MAX_LENGTH_TAG
    );
  })
  .withMessage(LENGTH_ERROR_MESSAGES["tag"]);

export const validateCreateProduct: ValidationChain[] = [
  validateBodyProductName,
  validateBodyProductDescription,
  validateBodyPrice,
  validateBodyImages,
  validateBodyTags,
];

export const validateUpdateProduct: ValidationChain[] = [
  validateBodyProductName,
  validateBodyProductDescription,
  validateBodyPrice,
  validateBodyImages,
  validateBodyTags,
];

export const validateProduct: ValidationChain[] = [
  validateBodyProductName,
  validateBodyProductDescription,
  validateBodyPrice,
  validateBodyImages,
  validateBodyTags,
];
