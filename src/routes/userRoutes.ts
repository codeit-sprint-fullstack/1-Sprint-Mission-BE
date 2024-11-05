import express, { Request, Response, NextFunction } from "express";
import * as userController from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get(
  "/me",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    const extendedReq = req as Request & {
      user?: {
        id: number;
        email: string;
        nickname: string;
        image: string;
        createdAt: Date;
        updatedAt: Date;
      };
    };
    userController.getUserById(extendedReq, res, next);
  }
);

export default router;
