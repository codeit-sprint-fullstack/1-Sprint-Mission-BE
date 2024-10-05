import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import {
  getProducts,
  postProduct,
  getProductId,
  deleteProduct,
  patchProduct,
  postFavorites,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", authenticateToken, postProduct);
router.get("/:productId", getProductId);
router.delete("/:productId", authenticateToken, deleteProduct);
router.patch("/:productId", authenticateToken, patchProduct);
router.post("/:productId/favorites", authenticateToken, postFavorites);
export default router;
