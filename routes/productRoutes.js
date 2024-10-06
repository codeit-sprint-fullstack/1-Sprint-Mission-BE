import express from "express";
import * as productController from "../controllers/productController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validateProductFields } from "../middlewares/validateProductFields.js";
import { imageUpload } from "../middlewares/imageUpload.js";

const router = express.Router();

//https://thrift-shop.onrender.com/products
router
  .route("/")
  .post(
    verifyToken,
    imageUpload.array("images", 3),
    validateProductFields,
    productController.createProduct
  )
  .get(productController.getProducts);

router
  .route("/:productId")
  .all(verifyToken)
  .get(productController.getProductsById)
  .patch(
    imageUpload.array("images", 3),
    validateProductFields,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

router
  .route("/:productId/favorite")
  .all(verifyToken)
  .post(productController.addFavorite)
  .delete(productController.deleteFavorite);

export default router;
