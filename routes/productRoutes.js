import express from "express";
import * as productController from "../controllers/productController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validateProductFields } from "../middlewares/validateProductFields.js";
// import { imageUpload } from "../middlewares/imageUpload.js";

const router = express.Router();

//https://thrift-shop.onrender.com/products
router.post(
  "/",
  verifyToken,
  validateProductFields,
  //imageUpload.array("images", 3),
  productController.createProduct
);
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
