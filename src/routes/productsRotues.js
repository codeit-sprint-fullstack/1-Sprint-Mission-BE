import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { getProducts, postProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", authenticateToken, postProduct);

export default router;
