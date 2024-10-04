import express from "express";
import { body, param, query } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import * as productService from "../services/productService.js";

const router = express.Router();

router.post(
  "/",
  [
    body("name").isString().isLength({ min: 1, max: 100 }),
    body("description").isString().notEmpty(),
    body("price").isFloat({ min: 0 }),
    body("image").isURL(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  })
);

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("order").optional().isIn(["recent", "price"]),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, order = "recent" } = req.query;
    const { products, totalCount } = await productService.getProducts(
      page,
      limit,
      order
    );
    res.json({ totalCount, list: products });
  })
);

router.get(
  "/:id",
  [param("id").isInt({ min: 1 })],
  validate,
  asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  })
);

router.put(
  "/:id",
  [
    param("id").isInt({ min: 1 }),
    body("name").optional().isString().isLength({ min: 1, max: 100 }),
    body("description").optional().isString().notEmpty(),
    body("price").optional().isFloat({ min: 0 }),
    body("image").optional().isURL(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  })
);

router.delete(
  "/:id",
  [param("id").isInt({ min: 1 })],
  validate,
  asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  })
);

export default router;
