import express from "express";
import {
  signUpController,
  signInController,
  refreshTokenController,
} from "../controllers/authController.js";
import {
  validateUserInput,
  validateEmailPasswordInput,
} from "../middlewares/validateInput.js";
import { validateEmailPassword } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/sign-up", validateUserInput, signUpController);
authRouter.post(
  "/sign-in",
  validateEmailPasswordInput,
  validateEmailPassword,
  signInController
);
authRouter.post("/refresh-token", refreshTokenController);

export default authRouter;
