import express, { Router } from "express";

import { validationHandler } from "../middlewares/error";
import { validateAuthorization } from "../middlewares/validator-auth-input";
import { validateGetProductCommentList } from "../middlewares/validator-product-comment-input";

import { validateListQuery } from "../middlewares/validator-query-input";

import { validateToken } from "../middlewares/token";
import productCommentController from "../controllers/product-comment-controller";

const productCommentListRouter: Router = express.Router();

productCommentListRouter.get(
  "/:productId/comments",
  validateAuthorization,
  validateGetProductCommentList,
  validateListQuery,
  validationHandler,
  validateToken,
  productCommentController.getProductCommentList
);

export default productCommentListRouter;
