import express from "express";

import imageController from "../controllers/image-controller";

import { validateAuthorization } from "../middlewares/validator-auth-input";
import { validationHandler } from "../middlewares/error";
import { validateToken } from "../middlewares/token";

const imageRouter = express.Router();

imageRouter.post(
  "/upload",
  validateAuthorization,
  validationHandler,
  validateToken,
  imageController.uploadImage
);

export default imageRouter;
