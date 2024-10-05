import express from "express";
import { body } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("name").notEmpty(),
  ],
  validate,
  asyncHandler(authController.signUp)
);

router.post(
  "/signin",
  [body("email").isEmail(), body("password").notEmpty()],
  validate,
  asyncHandler(authController.signIn)
);

router.post(
  "/refresh-token",
  [body("refreshToken").notEmpty()],
  validate,
  asyncHandler(authController.refreshToken)
);

export default router;
