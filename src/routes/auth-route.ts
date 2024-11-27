import express, { Router } from "express";

import {
  validateSignIp,
  validateSignUp,
  validateRefreshAccessToken,
} from "../middlewares/validator-auth-input";
import { validationHandler } from "../middlewares/error";
import authController from "../controllers/auth-controller";

const authRouter: Router = express.Router();

authRouter
  .post("/sign-up", validateSignUp, validationHandler, authController.signUp)
  .post("/sign-in", validateSignIp, validationHandler, authController.signIn)
  .post(
    "/refreshAccessToken",
    validateRefreshAccessToken,
    validationHandler,
    authController.refreshAccessToken
  );

export default authRouter;
