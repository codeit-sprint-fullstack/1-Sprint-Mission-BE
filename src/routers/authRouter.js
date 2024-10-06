import express from "express";
import passport from "../config/passport.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/authController.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  asyncHandler(controller.getGoogleLogin)
);
router.get("/logIn", asyncHandler(controller.createLogin));
router.post("/signUp", asyncHandler(controller.createSignup));
router.post("/refresh-token", asyncHandler(controller.createRefreshToken));

export default router;
