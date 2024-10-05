// src/controllers/productController.js
import * as productService from "../services/productService.js";

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming you have authentication middleware
    const product = await productService.getProductById(id, userId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
