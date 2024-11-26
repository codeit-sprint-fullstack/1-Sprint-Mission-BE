import express, { Request, Response, NextFunction } from "express";
import * as authController from "../controllers/authController";

const router = express.Router();
authController.refreshToken;
router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post(
  "/refresh-token",
  (req: Request, res: Response, next: NextFunction) => {
    authController.refreshToken(req, res, next);
  }
);

export default router;
