import * as productService from "../services/productService.js";
import {
  ValidationError,
  NotFoundError,
} from "../middlewares/errorMiddleware.js";

export const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
};

export const getProducts = async (req, res) => {
  const { page = 1, limit = 10, order = "recent" } = req.query;
  const { products, totalCount } = await productService.getProducts(
    page,
    limit,
    order
  );
  res.json({ totalCount, list: products });
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const product = await productService.getProductById(id, userId);
  if (!product) {
    throw new NotFoundError("상품을 찾을 수 없습니다.");
  }
  res.json(product);
};

export const updateProduct = async (req, res) => {
  const updatedProduct = await productService.updateProduct(
    req.params.id,
    req.body
  );
  if (!updatedProduct) {
    throw new NotFoundError("상품을 찾을 수 없습니다.");
  }
  res.json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(204).send();
};
