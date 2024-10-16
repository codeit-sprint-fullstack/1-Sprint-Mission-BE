// productService.js

import productModel from '../models/productModel.js';
import * as likeService from './likeService.js';

// 상품 생성
export const createProduct = async (data) => {
  return productModel.create(data);
};

// 상품 목록 조회
export const getProducts = async (page, limit, order) => {
  const skip = (page - 1) * limit;
  const orderBy = order === 'recent' ? { createdAt: 'desc' } : { price: 'asc' };

  const [products, totalCount] = await Promise.all([
    productModel.findMany(skip, Number(limit), orderBy),
    productModel.count(),
  ]);

  return { products, totalCount };
};

// 상품 상세 조회 (댓글 및 좋아요 정보 포함)
export const getProductById = async (id, userId) => {
  const product = await productModel.findUnique(id, {
    comments: {
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const isLiked = await likeService.checkIsLiked(userId, id, 'product');

  return {
    ...product,
    isLiked,
  };
};

// 상품 수정
export const updateProduct = async (id, data) => {
  return productModel.update(id, data);
};

// 상품 삭제
export const deleteProduct = async (id) => {
  return productModel.delete(id);
};
