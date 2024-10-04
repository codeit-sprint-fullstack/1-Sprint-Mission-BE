import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import {
  getProducts,
  postProduct,
  getProductId,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", authenticateToken, postProduct);
router.get("/:productId", getProductId);

export default router;
