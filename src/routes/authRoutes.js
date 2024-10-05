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
    body("nickname").isString().isLength({ min: 2, max: 30 }),
    body("password").isLength({ min: 6 }),
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

export default router;
