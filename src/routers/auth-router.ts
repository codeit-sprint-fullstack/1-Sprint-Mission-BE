import express from "express";
import validateData from "../middlewares/validate-data";
import authController from "../controllers/auth-controller";
import { verifyRefreshToken } from "../middlewares/authorization";

const authRouter = express.Router();

authRouter
  .post("/signUp", validateData.signUp(), authController.signUp)
  .post("/signIn", validateData.signIn(), authController.signIn)
  .post("/token/refresh", verifyRefreshToken, authController.reissueToken);
