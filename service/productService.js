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
    case "favorite":
      orderOption = { favorite: "desc" };
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

const getById = async (id) => {
  const res = await productModel.getById(id);
  return res;
};

const createProduct = async (data) => {
  const res = await productModel.create(data);
  return res;
};

const updateProduct = async (id, data) => {
  const res = await productModel.update(id, data);
  return res;
};

const deleteProduct = async (id) => {
  return await productModel.deleteItem(id, data);
};

export default {
  getProducts,
  getById,
  updateProduct,
  deleteProduct,
  createProduct,
};
