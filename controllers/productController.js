import * as productService from "../services/productService.js";

export const createProduct = async (req, res) => {
  const { images, name, price, description, tags } = req.body;
  //   const images = req.files.map((file) => file.path);
  try {
    const userId = req.user.id;
    const userNickname = req.user.nickname;
    const newProduct = await productService.createProduct(
      images,
      name,
      price,
      description,
      tags,
      userId,
      userNickname
    );
    res.status(200).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product", error });
  }
};

export const getProducts = async (req, res) => {
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

    res.status(200).json({
      list,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};

export const getProductsById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { images, tags, price, description, name } = req.body;

    const updatedProduct = await productService.updateProduct(
      productId,
      images,
      tags,
      price,
      description,
      name
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    await productService.deleteProduct(productId);

    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const addFavorite = await productService.addFavorite(productId);

    res.status(200).json(addFavorite);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({
      message: "Failed to add favorite",
      error: error.message,
    });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const deleteFavorite = await productService.deleteFavorite(productId);

    res.status(200).json(deleteFavorite);
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({
      message: "Failed to delete favorite",
      error: error.message,
    });
  }
};
