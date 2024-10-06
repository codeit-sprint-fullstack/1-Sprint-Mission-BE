import {
  getProductRepository,
  getProductListRepository,
  postProductRepository,
  patchProductRepository,
  deleteProductRepository,
} from '../repository/productRepository.js';

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

export const postProductService = async ({
  name,
  description,
  price,
  tags,
}) => {
  return await postProductRepository({ name, description, price, tags });
};

export const patchProductService = async ({ id, body }) => {
  return await patchProductRepository({ id, ...body });
};

export const deleteProductService = async ({ id }) => {
  return await deleteProductRepository({ id });
};
