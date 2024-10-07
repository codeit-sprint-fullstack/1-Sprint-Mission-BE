import express from "express";
import passport from "../config/passport.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/authController.js";
import { authentication } from "../middlewares/auth.js";

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
router.post("/logIn", asyncHandler(controller.createLogin));
router.post("/signUp", asyncHandler(controller.createSignup));
router.post(
  "/refresh-token",
  passport.authenticate("refresh-token", {
    session: false,
  }),
  asyncHandler(controller.createRefreshToken)
);

export default router;
