import express, { Router } from "express";

import { validationHandler } from "../middlewares/error";
import { validateAuthorization } from "../middlewares/validator-auth-input";
import { validateUpdateUser } from "../middlewares/validator-user-input";
import { validateToken } from "../middlewares/token";
import userController from "../controllers/user-controller";

const userRouter: Router = express.Router();

userRouter
  .get(
    "/:userId",
    validateAuthorization,
    validationHandler,
    validateToken,
    userController.getUser
  )
  .patch(
    "/:userId",
    validateAuthorization,
    validateUpdateUser,
    validationHandler,
    validateToken,
    userController.modifyUser
  );

export default userRouter;
