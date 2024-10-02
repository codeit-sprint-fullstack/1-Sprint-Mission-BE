import express from "express";
import { signup, login } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { getUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authenticateToken, getUser);

export default router;
