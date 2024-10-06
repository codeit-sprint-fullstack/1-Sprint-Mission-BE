// productRoutes.js

import express from "express";
import { body, param, query } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import * as productController from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware,
    [
      body("name").isString().isLength({ min: 1, max: 100 }),
      body("description").isString().notEmpty(),
      body("price").isFloat({ min: 0 }),
      body("image").isURL(),
    ],
    validate,
    asyncHandler(productController.createProduct)
  )
  .get(
    [
      query("page").optional().isInt({ min: 1 }),
      query("limit").optional().isInt({ min: 1, max: 100 }),
      query("order").optional().isIn(["recent", "price"]),
    ],
    validate,
    asyncHandler(productController.getProducts)
  );

router
  .route("/:id")
  .get(
    [param("id").isInt({ min: 1 })],
    validate,
    asyncHandler(productController.getProductById)
  )
  .put(
    authMiddleware,
    [
      param("id").isInt({ min: 1 }),
      body("name").optional().isString().isLength({ min: 1, max: 100 }),
      body("description").optional().isString().notEmpty(),
      body("price").optional().isFloat({ min: 0 }),
      body("image").optional().isURL(),
    ],
    validate,
    asyncHandler(productController.updateProduct)
  )
  .delete(
    authMiddleware,
    [param("id").isInt({ min: 1 })],
    validate,
    asyncHandler(productController.deleteProduct)
  );

router.post(
  "/:id/like",
  authMiddleware,
  [param("id").isInt({ min: 1 })],
  validate,
  asyncHandler(productController.toggleLike)
);

export default router;
