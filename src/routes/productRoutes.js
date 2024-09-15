import express from "express";
import * as p from "../controllers/productController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getProductComments,
  createProductComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", asyncHandler(p.getProducts));
router.get("/:productId", asyncHandler(p.getProductById));
router.post("/", asyncHandler(p.createProduct));
router.patch("/:productId", asyncHandler(p.updateProductById));
router.delete("/:productId", asyncHandler(p.deleteProductById));

//get comments, create comment
router.get("/:productId/comments", asyncHandler(getProductComments));
router.post("/:productId/comments", asyncHandler(createProductComment));

export default router;
