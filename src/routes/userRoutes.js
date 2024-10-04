import express from "express";
import { signup, login, refreshToken } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { getUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refreshToken", refreshToken);

router.get("/me", authenticateToken, getUser);

export default router;
