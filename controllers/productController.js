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
    const { productId } = req.params;
    const {
      name,
      price,
      description,
      tags,
      existingImages = [],
      deletedImages = [],
    } = req.body;

    // 새로 업로드된 이미지 파일들을 배열로 변환
    const newImages = req.files
      ? req.files.map((file) => `/uploads/${path.basename(file.path)}`)
      : [];

    // 기존 이미지에서 삭제할 이미지를 제외한 최종 이미지 목록 생성
    const finalImages = existingImages.filter(
      (url) => !deletedImages.includes(url)
    );

    // 최종적으로 업데이트할 이미지 목록을 생성
    const images = [...finalImages, ...newImages];

    // 여기서 `deletedImages`에 있는 이미지를 서버 파일 시스템에서 삭제하는 로직을 구현할 수 있음
    deletedImages.forEach((img) => {
      const filePath = path.join(process.cwd(), img);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 파일 삭제
      }
    });

    const updatedProduct = await productService.updateProduct(
      parseInt(productId),
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
