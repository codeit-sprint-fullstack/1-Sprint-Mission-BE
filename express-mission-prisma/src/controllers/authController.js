import express from "express";
import authService from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";
import validateData from "../middlewares/validateData.js";

const authController = express.Router();

authController.route("/").post(
  validateData.singUp,
  asyncHandler(async (req, res, next) => {
    const singUp = await authService.singUp(req.body);
    res.status(201).send(singUp);
  })
);
