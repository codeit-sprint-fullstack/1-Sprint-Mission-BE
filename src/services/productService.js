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
