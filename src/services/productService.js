import { CreateProduct, PatchProduct, assert } from "../validations/structs.js";
import productRepository from "../repositories/productRepository.js";

export async function getProducts({ orderBy, page, pageSize, keyword }) {
  const offset = (page - 1) * pageSize;

  let sortOption;
  switch (orderBy) {
    case "favorite":
      sortOption = { favoriteCount: "desc" };
      break;
    case "recent":
    default:
      sortOption = { createdAt: "desc" };
      break;
  }

  let searchQuery = {};
  if (keyword && keyword.trim() !== "")
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

export async function getProduct(id) {
  return await productRepository.getById(id);
}

export async function createProduct(data) {
  assert(data, CreateProduct);
  return await productRepository.create(data);
}

export async function updateProduct(id, data) {
  assert(data, PatchProduct);
  return await productRepository.updateById(id, data);
}

export async function deleteProduct(id) {
  await productRepository.deleteById(id);
  return { message: "상품이 삭제되었습니다" };
}

export async function createLike(productId, userId) {
  const updatedProduct = await prisma.$transaction(async () => {
    const hasUserLiked = await productRepository.findLikedUser(
      productId,
      userId
    );

    if (hasUserLiked) {
      const error = new Error("이미 좋아요를 한 상품입니다.");
      error.statCode = 409;
      throw error;
    }

    const currentFavoriteCount = hasUserLiked.favoriteCount;
    const updatedProduct = await productRepository.updateLike(
      productId,
      currentFavoriteCount,
      userId
    );
    return updatedProduct;
  });

  return updatedProduct;
}

export async function createFavorite(productId, userId) {
  const action = "favorite";
  return handleUpdateFavorite({ productId, userId, action });
}

export async function deleteFavorite({ productId, userId }) {
  const action = "unfavorite";
  return handleUpdateFavorite({ productId, userId, action });
}

export async function handleUpdateFavorite({ productId, userId, action }) {
  const updatedProduct = await prisma.$transaction(async () => {
    const hasFavorite = await productRepository.findFavoriteUser({
      productId,
      userId,
    });

    if (action === "favorite" && hasFavorite) {
      const error = new Error("이미 좋아요를 한 상품입니다.");
      error.statCode = 409;
      throw error;
    }

    if (action === "unfavorite" && !hasFavorite) {
      const error = new Error("이미 좋아요를 취소 한 상품입니다.");
      error.statCode = 409;
      throw error;
    }

    if (action === "favorite") {
      return await productRepository.addFavorite({
        productId,
        currentFavoriteCount,
        userId,
      });
    } else if (action === "unfavorite") {
      return await productRepository.removeFavorite({
        productId,
        currentFavoriteCount,
        userId,
      });
    }
  });

  return updatedProduct;
}
