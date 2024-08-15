import express from "express";
import * as p from "../controllers/productController.js";
import { asyncHandler } from "../utils/errorHandler.js";
import {
  getProductComments,
  createProductComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", asyncHandler(p.getProducts));
router.get("/:id", asyncHandler(p.getProductById));
router.post("/", asyncHandler(p.createProduct));
router.patch("/:id", asyncHandler(p.updateProductById));
router.delete("/:id", asyncHandler(p.deleteProductById));

//get comments, create comment
router.get("/:id/comments", asyncHandler(getProductComments));
router.post("/:id/comments", asyncHandler(createProductComment));

export default router;
