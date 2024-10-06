import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/productController.js";
import validateUuid from "../middlewares/validateUuid.js";
import { authentication, productAuthorization } from "../middlewares/auth.js";

const router = express.Router();

router.use(authentication);
router.use("/:productId", validateUuid);

router.get("/", asyncHandler(controller.getProducts));
router.get("/:productId", asyncHandler(controller.getProductById));
router.post("/", productAuthorization, asyncHandler(controller.createProduct));
router.patch(
  "/:productId",
  productAuthorization,
  asyncHandler(controller.updateProductById)
);
router.delete(
  "/:productId",
  productAuthorization,
  asyncHandler(controller.deleteProductById)
);

export default router;
