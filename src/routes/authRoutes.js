// routes/authRoutes.js

import express from "express";
import { body } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import validate from "../middlewares/validate.js"; // 수정: default export로 변경
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/signUp",
  validate([
    body("email").isEmail().withMessage("유효한 이메일 주소를 입력하세요."),
    body("nickname")
      .isString()
      .isLength({ min: 2, max: 30 })
      .withMessage("닉네임은 2자 이상 30자 이하로 입력하세요."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("비밀번호는 6자 이상이어야 합니다."),
    body("passwordConfirmation")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("비밀번호가 일치하지 않습니다."),
  ]),
  asyncHandler(authController.signUp)
);

router.post(
  "/signIn",
  validate([
    body("email").isEmail().withMessage("유효한 이메일 주소를 입력하세요."),
    body("password").notEmpty().withMessage("비밀번호를 입력하세요."),
  ]),
  asyncHandler(authController.signIn)
);

export default router;
