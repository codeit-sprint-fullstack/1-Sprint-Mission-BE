import express from "express";
import {
  signUpController,
  signInController,
  refreshTokenController,
} from "../controllers/authController.js";
import {
  validateUserInput,
  validatteEmailPasswordInput,
} from "../middlewares/validateInput.js";
import { validateEmailPassword } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/sign-up", validateUserInput, signUpController);
authRouter.post(
  "/sign-in",
  validatteEmailPasswordInput,
  validateEmailPassword,
  signInController
);
authRouter.post("/refresh-token", refreshTokenController);

export default authRouter;
