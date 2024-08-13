import { Router } from "express";
import Product from "../models/product.js";
import asyncHandler from "../asyncHandler.js";

const router = Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, description, price, tags } = req.body;
    if (!name || !description || !price || !tags) {
      return res.status(400).json({ error: "Invalid request data" });
    }
    const product = new Product({
      name,
      description,
      price,
      tags,
    });
    await product.save();
    res.status(201).json(product);
  })
);

export default router;
