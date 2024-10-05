// src/services/productService.js
import { prisma } from "../utils/prisma.js";

// 상품 생성
export const createProduct = async (data) => {
  return prisma.product.create({ data });
};

// 상품 목록 조회
export const getProducts = async (page, limit, order) => {
  const skip = (page - 1) * limit;
  const orderBy = order === "recent" ? { createdAt: "desc" } : { price: "asc" };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: Number(limit),
      orderBy,
    }),
    prisma.product.count(),
  ]);

  return { products, totalCount };
};

// 상품 상세 조회 (댓글 및 좋아요 정보 포함)
export const getProductById = async (id, userId) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      comments: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
      favorites: {
        where: { userId: userId },
      },
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return {
    ...product,
    isFavorite: product.favorites.length > 0,
    favorites: undefined, // Remove favorites array from response
  };
};

// 상품 수정
export const updateProduct = async (id, data) => {
  return prisma.product.update({
    where: { id: Number(id) },
    data,
  });
};

// 상품 삭제
export const deleteProduct = async (id) => {
  return prisma.product.delete({ where: { id: Number(id) } });
};
