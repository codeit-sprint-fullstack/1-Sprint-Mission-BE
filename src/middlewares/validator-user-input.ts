import { body, ValidationChain } from "express-validator";

import { userSchema } from "../constants/user";

import { LENGTH_ERROR_MESSAGES } from "../constants/error";

const validateBodyUpdateUserNickname: ValidationChain = body("nickname")
  .optional()
  .isLength({
    min: userSchema.MIN_LENGTH_NICKNAME,
    max: userSchema.MAX_LENGTH_NICKNAME,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["nickname"]);

const validateBodyUpdateUserImage: ValidationChain = body("image")
  .optional()
  .isLength({
    min: userSchema.MIN_LENGTH_IMAGE,
    max: userSchema.MAX_LENGTH_IMAGE,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["image"]);

const validateBodyUpdateUserPassword: ValidationChain = body("password")
  .optional()
  .isLength({
    min: userSchema.MIN_LENGTH_PASSWORD,
    max: userSchema.MAX_LENGTH_PASSWORD,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["password"]);

export const validateUpdateUser: ValidationChain[] = [
  validateBodyUpdateUserNickname,
  validateBodyUpdateUserImage,
  validateBodyUpdateUserPassword,
];
