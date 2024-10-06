import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/userController.js";

const router = express.Router();

router.get("/me", asyncHandler(controller.getUserMe));
