import express from "express";
import productService from "../service/productService.js";

const router = express.Router();
router.post("/", productService);
router.get("/", productService);
router.get("/:id", productService);
router.patch("/:id", productService);
router.delete("/:id", productService);

export default router;
