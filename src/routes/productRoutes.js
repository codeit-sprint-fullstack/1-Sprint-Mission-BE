import express from "express";
import productController from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:productId", productController.getProductById);
router.patch("/:productId", authMiddleware, productController.updateProduct);
router.delete("/:productId", authMiddleware, productController.deleteProduct);
router.post(
  "/:productId/favorite",
  authMiddleware,
  productController.addFavorite
);
router.delete(
  "/:productId/favorite",
  authMiddleware,
  productController.removeFavorite
);

export default router;
