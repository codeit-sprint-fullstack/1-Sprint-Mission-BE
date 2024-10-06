import * as productService from "../services/productService.js";
import {
  ValidationError,
  NotFoundError,
} from "../middlewares/errorMiddleware.js";

// 상품 생성
export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  }
};

// 상품 목록 조회
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, order = "recent" } = req.query;
    const { products, totalCount } = await productService.getProducts(
      page,
      limit,
      order
    );
    res.json({ totalCount, list: products });
  } catch (error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 상품 상세 조회
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // 로그인한 사용자 ID
    const product = await productService.getProductById(id, userId);
    if (!product) {
      throw new NotFoundError("상품을 찾을 수 없습니다.");
    }
    res.json(product);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  }
};

// 상품 수정
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body
    );
    if (!updatedProduct) {
      throw new NotFoundError("상품을 찾을 수 없습니다.");
    }
    res.json(updatedProduct);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  }
};

// 상품 삭제
export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 좋아요 기능
export const toggleLike = async (req, res) => {
  try {
    const result = await productService.toggleLike(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
