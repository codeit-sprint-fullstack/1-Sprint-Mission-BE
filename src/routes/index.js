import express from "express";
import productRoutes from "./productRoutes.js";
import articleRoutes from "./articleRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

router.use("/products", productRoutes);
router.use("/articles", articleRoutes);
router.use("/auth", authRoutes);

export default router;
