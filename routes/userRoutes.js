import express from "express";
import * as userController from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/me", verifyToken, userController.getUserById);

export default router;
