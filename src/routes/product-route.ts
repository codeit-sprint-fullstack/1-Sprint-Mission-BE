import express, { Router } from "express";

import { validationHandler } from "../middlewares/error";
import { validateAuthorization } from "../middlewares/validator-auth-input";
import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../middlewares/validator-product-input";
import { validateListQuery } from "../middlewares/validator-query-input";
import { isAuthorizedProductIdParam } from "../middlewares/product";
import { validateToken, checkToken } from "../middlewares/token";
import productController from "../controllers/product-controller";
import productCommentController from "../controllers/product-comment-controller";

const productRouter: Router = express.Router();

productRouter
  .post(
    "/",
    validateAuthorization,
    validateCreateProduct,
    validationHandler,
    validateToken,
    productController.createProduct
  )
  .get(
    "/",
    validateListQuery,
    validationHandler,
    checkToken,
    productController.getProductList
  )
  .get(
    "/:productId",
    validateAuthorization,
    validationHandler,
    validateToken,
    productController.getProduct
  )
  .get(
    "/:productId/comments",
    validateListQuery,
    validationHandler,
    productCommentController.getProductCommentList
  )
  .patch(
    "/:productId",
    validateAuthorization,
    validateUpdateProduct,
    validationHandler,
    validateToken,
    isAuthorizedProductIdParam,
    productController.modifyProduct
  )
  .delete(
    "/:productId",
    validateAuthorization,
    validationHandler,
    validateToken,
    isAuthorizedProductIdParam,
    productController.deleteProduct
  )
  .patch(
    "/:productId/favorite",
    validateAuthorization,
    validationHandler,
    validateToken,
    isAuthorizedProductIdParam,
    productController.increaseProductFavorite
  )
  .delete(
    "/:productId/favorite",
    validateAuthorization,
    validationHandler,
    validateToken,
    productController.decreaseProductFavorite
  );

export default productRouter;
