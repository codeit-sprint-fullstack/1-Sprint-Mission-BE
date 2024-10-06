import * as productService from "../services/productService.js";
import path from "path";

export const createProduct = async (req, res, next) => {
  try {
    const images = req.files
      ? req.files.map((file) => `/uploads/${path.basename(file.path)}`)
      : req.body.images || [];
    const { name, price, description, tags } = req.body;
    const { id: userId, nickname: userNickname } = req.user;

    const newProduct = await productService.createProduct(
      images,
      name,
      parseInt(price),
      description,
      tags,
      userId,
      userNickname
    );

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      keyword = "",
      orderBy = "recent",
    } = req.query;

    const { list, totalCount } = await productService.getProducts(
      parseInt(page),
      parseInt(pageSize),
      keyword,
      orderBy
    );

    res.status(200).json({ list, totalCount });
  } catch (error) {
    next(error);
  }
};

export const getProductsById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const product = await productService.getProductById(
      parseInt(productId),
      userId
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const images = req.files
      ? req.files.map((file) => `/uploads/${path.basename(file.path)}`)
      : req.body.images || [];
    const { name, price, description, tags } = req.body;

    const updatedProduct = await productService.updateProduct(
      images,
      name,
      parseInt(price),
      description,
      tags
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await productService.deleteProduct(parseInt(productId));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const updatedProduct = await productService.addFavorite(
      parseInt(productId),
      userId
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const updatedProduct = await productService.deleteFavorite(
      parseInt(productId),
      userId
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};
