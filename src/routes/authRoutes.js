import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signUp", authController.signUp);
router.post("/signIn", authController.signIn);
router.post("/refresh-token", authController.refreshToken);

export default router;
