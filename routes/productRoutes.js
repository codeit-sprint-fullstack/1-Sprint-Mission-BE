import express from "express";
import * as productController from "../controllers/productController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:productId", verifyToken, productController.getProductsById);
router.patch("/:productId", verifyToken, productController.updateProduct);
router.delete("/:productId", verifyToken, productController.deleteProduct);
router.post("/:productId/favorite", verifyToken, productController.addFavorite);
router.delete(
  "/:productId/favorite",
  verifyToken,
  productController.deleteFavorite
);

export default router;
