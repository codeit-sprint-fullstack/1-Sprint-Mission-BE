import express from "express";
import validateData from "../middlewares/validate-data";
import authController from "../controllers/auth-controller";

const authRouter = express.Router();

authRouter.post("/singUp", validateData.singUp(), authController.singUp);
