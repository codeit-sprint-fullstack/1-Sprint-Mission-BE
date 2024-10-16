import * as productRepository from '../repositories/productRepository.js';
import prisma from '../config/prisma.js';

export async function getProducts({ orderBy, page, pageSize, keyword }) {
  const offset = (page - 1) * pageSize;

  let sortOption;
  switch (orderBy) {
    case 'favorite':
      sortOption = { favoriteCount: 'desc' };
      break;
    case 'recent':
    default:
      sortOption = { createdAt: 'desc' };
      break;
  }

  let searchQuery = {};
  if (keyword && keyword.trim() !== '')
    searchQuery = {
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ],
    };

  const [totalCount, list] = await Promise.all([
    productRepository.getTotalCount(searchQuery),
    productRepository.getAll({ searchQuery, sortOption, offset, pageSize }),
  ]);

  return { totalCount, list };
}

export async function getProduct(productId, userId) {
  const product = await productRepository.getProductById(productId);
  if (!product) {
    const error = new Error('없는 상품입니다');
    error.code = 404;
    throw error;
  }
  const hasFavorite = await productRepository.findFavoriteUser(prisma, {
    productId,
    userId,
  });
  if (!hasFavorite) {
    return { ...product, isFavorite: false };
  }
  return { ...product, isFavorite: true };
}

export async function createProduct(userId, data) {
  return await productRepository.create(userId, data);
}

export async function updateProduct(id, data) {
  return await productRepository.updateById(id, data);
}

export async function deleteProduct(id) {
  await productRepository.deleteById(id);
  return { message: '상품이 삭제되었습니다' };
}

export async function createFavorite(productId, userId) {
  const action = 'favorite';
  const updatedProduct = await handleUpdateFavorite({
    productId,
    userId,
    action,
  });
  if (!updatedProduct) {
    const error = new Error('트랜젝션 실패');
    error.code = 404;
    throw error;
  }
  return { ...updatedProduct, isFavorite: true };
}

export async function deleteFavorite(productId, userId) {
  const action = 'unfavorite';
  const updatedProduct = await handleUpdateFavorite({
    productId,
    userId,
    action,
  });

  if (!updatedProduct) {
    const error = new Error('트랜젝션 실패');
    error.code = 404;
    throw error;
  }

  return { ...updatedProduct, isFavorite: false };
}

export async function handleUpdateFavorite({ productId, userId, action }) {
  try {
    const productWithUpdatedFavorite = await prisma.$transaction(async (tx) => {
      const isActionFavorite = action === 'favorite';
      const updateOption = isActionFavorite ? 'connect' : 'disconnect';

      const hasFavorite = await productRepository.findFavoriteUser(tx, {
        productId,
        userId,
      });

      if (action === 'favorite' && hasFavorite) {
        const error = new Error('이미 좋아요를 한 상품입니다.');
        error.code = 409;
        throw error;
      }

      if (action === 'unfavorite' && !hasFavorite) {
        const error = new Error('이미 좋아요를 취소 한 상품입니다.');
        error.code = 409;
        throw error;
      }

      const product = await productRepository.findFavoriteCount(tx, productId);

      if (!product) {
        const error = new Error('존재하지 않는 상품입니다.');
        error.code = 404;
        throw error;
      }

      const currentFavoriteCount = product.favoriteCount;

      return await productRepository.updateFavoriteStatus(tx, {
        productId,
        currentFavoriteCount,
        userId,
        updateOption,
      });
    });
    return productWithUpdatedFavorite;
  } catch (error) {
    console.error('transaction failed:', error);
    throw error;
  }
}
