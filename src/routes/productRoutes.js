import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/productController.js";
import validateUuid from "../middlewares/validateUuid.js";

const router = express.Router();

router.use("/:productId", validateUuid);

router.get("/", asyncHandler(controller.getProducts));
router.get("/:productId", asyncHandler(controller.getProductById));
router.post("/", asyncHandler(controller.createProduct));
router.patch("/:productId", asyncHandler(controller.updateProductById));
router.delete("/:productId", asyncHandler(controller.deleteProductById));

export default router;
