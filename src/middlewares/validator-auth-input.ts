import { header, body, ValidationChain } from "express-validator";

import { userSchema } from "../constants/user";
import {
  CUSTOM_ERROR_INFO,
  EMPTY_ERROR_MESSAGES,
  LENGTH_ERROR_MESSAGES,
  PATTERN_ERROR_MESSAGES,
} from "../constants/error";

const validateBodyEmail: ValidationChain = body("email")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["email"])
  .bail()
  .isEmail()
  .withMessage(PATTERN_ERROR_MESSAGES["email"])
  .bail()
  .isLength({ max: userSchema.MAX_LENGTH_EMAIL })
  .withMessage(LENGTH_ERROR_MESSAGES["email"]);

const validateBodyPassword: ValidationChain = body("password")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["password"])
  .bail()
  .isLength({
    min: userSchema.MIN_LENGTH_PASSWORD,
    max: userSchema.MAX_LENGTH_PASSWORD,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["password"])
  .bail()
  .custom((value) => {
    if (!/^([a-z]|[A-Z]|[0-9]|[!@#$%^&*])+$/.test(value)) {
      throw new Error(PATTERN_ERROR_MESSAGES["password"]);
    }
    return true;
  });

const validateBodyNickname: ValidationChain = body("nickname")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["nickname"])
  .bail()
  .isLength({
    min: userSchema.MIN_LENGTH_NICKNAME,
    max: userSchema.MAX_LENGTH_NICKNAME,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["nickname"]);

const validateBodyName: ValidationChain = body("name")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["name"])
  .bail()
  .isLength({
    min: userSchema.MIN_LENGTH_NAME,
    max: userSchema.MAX_LENGTH_NAME,
  })
  .withMessage(LENGTH_ERROR_MESSAGES["name"]);

const validateBodyRefreshToken: ValidationChain = body("RefreshToken")
  .notEmpty()
  .withMessage(EMPTY_ERROR_MESSAGES["token"])
  .bail()
  .isJWT()
  .withMessage(PATTERN_ERROR_MESSAGES["token"]);

export const validateSignUp: ValidationChain[] = [
  validateBodyEmail,
  validateBodyPassword,
  validateBodyNickname,
  validateBodyName,
];

export const validateSignIp: ValidationChain[] = [
  validateBodyEmail,
  validateBodyPassword,
];

export const validateRefreshAccessToken: ValidationChain[] = [
  validateBodyRefreshToken,
];

const validateHeaderToken: ValidationChain = header("authorization")
  .notEmpty()
  .withMessage(CUSTOM_ERROR_INFO[40100])
  .bail()
  .custom((value) => {
    if (!value.startsWith("Bearer ")) {
      throw new Error(PATTERN_ERROR_MESSAGES["token"]);
    }
    const token = value.split(" ")[1];
    if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token)) {
      throw new Error(PATTERN_ERROR_MESSAGES["token"]);
    }
    return true;
  });

export const validateAuthorization: ValidationChain[] = [validateHeaderToken];
