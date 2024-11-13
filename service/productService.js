import {
  getProductRepository,
  getProductListRepository,
  postProductRepository,
  patchProductRepository,
  deleteProductRepository,
  getProductTotalCountRepository,
  findProductLikeRepository,
  postProductLikeRepository,
  deleteProductLikeRepository,
} from '../repository/productRepository.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProductService = async ({ id }) => {
  return await getProductRepository({ id });
};

export const getProductListService = async ({
  offset,
  limit,
  order,
  search,
}) => {
  return await getProductListRepository({ offset, limit, order, search });
};

export const getProductTotalCountService = async ({ search }) => {
  return await getProductTotalCountRepository({ search });
};

export const postProductService = async ({
  name,
  description,
  price,
  tags,
  imageUrls,
}) => {
  return await postProductRepository({
    name,
    description,
    price,
    tags,
    imageUrls,
  });
};

export const patchProductService = async ({ id, body }) => {
  return await patchProductRepository({ id, ...body });
};

export const deleteProductService = async ({ id }) => {
  return await deleteProductRepository({ id });
};

export const postProductLikeService = async ({ userId, productId }) => {
  return await prisma.$transaction(async (prisma) => {
    const isLike = await likeRepository.findProductLikeRepository({
      userId,
      productId,
    });
    if (isLike) {
      throw new Error('이미 좋아요가 눌려 있습니다.');
    }
    return await postProductLikeRepository({ userId, productId });
  });
};

export const deleteProductLikeService = async ({ userId, productId }) => {
  return await prisma.$transaction(async (prisma) => {
    const isLike = await likeRepository.findProductLikeRepository({
      userId,
      productId,
    });
    if (!isLike) {
      throw new Error('좋아요가 눌려 있지 않습니다.');
    }
    return await deleteProductLikeRepository({ userId, productId });
  });
};
