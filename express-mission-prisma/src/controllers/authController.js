import express from "express";
import authService from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import validateData from "../middlewares/validateData.js";

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
    const singIn = await authService.singIn(req.body)
    res.send(singIn)
  })
);

export default authController;
