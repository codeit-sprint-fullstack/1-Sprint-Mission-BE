import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/userController.js";

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  asyncHandler(controller.getGoogleLogin)
);
router.get("/auth/login", asyncHandler(controller.createLogin));
router.post("/auth/signUp", asyncHandler(controller.createSignup));
router.post("/auth/refresh-token", asyncHandler(controller.createRefreshToken));
