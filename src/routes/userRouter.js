import express from "express";
import {
  getMeController,
  modifyMeController,
  modifyPasswordController,
  getMyProductsController,
  getMyFavoriteProductsController,
} from "../controllers/userController.js";
import {
  validateAccessToken,
  validateIdPassword,
} from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.use(validateAccessToken);

userRouter.get("/me", getMeController);
userRouter.patch("/me", modifyMeController);
userRouter.patch("/password", validateIdPassword, modifyPasswordController);
userRouter.get("/me/products", getMyProductsController);
userRouter.get("/me/favorite-products", getMyFavoriteProductsController);

export default userRouter;
