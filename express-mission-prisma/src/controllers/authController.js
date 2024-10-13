import express from "express";
import validateData from "../middlewares/validateData.js";
import { verifyRefreshToken } from "../middlewares/authorizationMiddleware.js";
import authService from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";

const authController = express.Router();

authController.route("/singUp").post(
  validateData.singUp(),
  asyncHandler(async (req, res, next) => {
    const singUp = await authService.singUp(req.body);
    res.status(201).send(singUp);
  })
);

authController.route("/singIn").post(
  validateData.singIn(),
  asyncHandler(async (req, res, next) => {
    const singIn = await authService.singIn(req.body);
    const accessToken = await authService.createToken(singIn);
    const refreshToken = await authService.createToken(singIn, "refresh");
    await authService.update(singIn.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.send({
      user: singIn,
      Token: {
        accessToken,
        refreshToken,
      },
    });
  })
);

authController.route("/token/refresh").post(
  verifyRefreshToken,
  asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.cookies;
    const { userId } = req.auth;
    const accessToken = await authService.refreshToken(userId, refreshToken);
    res.send({ accessToken });
  })
);

export default authController;
