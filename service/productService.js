import productModel from "../model/productModel.js";

const getProducts = async ({
  orderBy,
  page = 1,
  pageSize = 10,
  keyword = "",
}) => {
  const offset = (page - 1) * pageSize; //page가 3이면 3-1 = 2 * count 만큼 스킵
  let orderOption;
  switch (orderBy) {
    case "recent":
      orderOption = { createAt: "desc" };
      break;
    case "favoriteCount":
      orderOption = { favoriteCount: "desc" };
      break;
    default:
      orderOption = { createAt: "desc" };
      break;
  }
  const [totalCount, products] = await Promise.all([
    productModel.getTotalCount(keyword),
    productModel.getList(pageSize, offset, orderOption, keyword),
  ]);
  const hasMore = totalCount - page * pageSize > 0;
  return { totalCount, products, hasMore };
};

const getProduct = async ({ userId, productId }) => {
  const product = await productModel.getById(productId);
  if (!product) {
    const error = new Error("Not Found");
    error.status = 404;
    error.message = "상품을 찾지 못했습니다.";
    throw error;
  }
  //현재 사용자의 좋아요 상태를 확인 후 반환 -> 좋아요 상태가 아니면 null
  const existingLike = await productModel.existingLike(userId, productId);
  return { product, existingLike };
};

const createProduct = async (data) => {
  const product = await productModel.create(data);
  if (!product) {
    const error = new Error("Not Found");
    error.status = 404;
    error.message = "상품을 찾지 못했습니다.";
    throw error;
  }
  return product;
};

const updateProduct = async (id, data) => {
  const product = await productModel.update(id, data);
  if (!product) {
    const error = new Error("Not Found");
    error.status = 404;
    error.message = "상품을 찾지 못했습니다.";
    throw error;
  }
  return product;
};

const likeProduct = async ({ userId, productId }) => {
  const product = await productModel.likeProduct({ productId, userId });
  return product;
};

const unlikeProduct = async ({ userId, productId }) => {
  const product = await productModel.unlikeProduct({ productId, userId });
  return product;
};

const deleteProduct = async (id) => {
  const product = await productModel.deleteItem(id, data);
  if (!product) {
    const error = new Error("Not found");
    error.status = 404;
    error.message = "상품을 찾지 못했습니다.";
    throw error;
  }
  return product;
};

export default {
  getProducts,
  getProduct,
  updateProduct,
  likeProduct,
  unlikeProduct,
  deleteProduct,
  createProduct,
};
