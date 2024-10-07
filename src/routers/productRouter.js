import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as controller from "../controllers/productController.js";
import validateUuid from "../middlewares/validateUuid.js";
import { authentication, productAuthorization } from "../middlewares/auth.js";

const router = express.Router();

router.use(authentication);

router.get("/", asyncHandler(controller.getProductList));
router.get(
  "/:productId",
  validateUuid,
  asyncHandler(controller.getProductById)
);
router.post("/", asyncHandler(controller.createProduct));
router.patch(
  "/:productId",
  productAuthorization,
  validateUuid,
  asyncHandler(controller.updateProductById)
);
router.delete(
  "/:productId",
  productAuthorization,
  validateUuid,
  asyncHandler(controller.deleteProductById)
);

export default router;
