import {
  ParsedProductIdParam,
  ParsedProductListParams,
  ProductCreate,
  ProductSearchParam,
} from "../dto/product.dto.js";
import {
  getProductRepository,
  getProductListRepository,
  postProductRepository,
  patchProductRepository,
  deleteProductRepository,
  getProductTotalCountRepository,
} from "../repository/productRepository.js";
import { Product } from "@prisma/client";

export const getProductService = async ({ id }: ParsedProductIdParam) => {
  return await getProductRepository({ id });
};

export const getProductListService = async (
  params: ParsedProductListParams
) => {
  return await getProductListRepository(params);
};

export const getProductTotalCountService = async ({
  search,
}: ProductSearchParam) => {
  return await getProductTotalCountRepository({ search });
};

export const postProductService = async ({
  name,
  description,
  price,
  tags,
  imageUrls,
}: ProductCreate) => {
  return await postProductRepository({
    name,
    description,
    price,
    tags,
    imageUrls,
  });
};

export const patchProductService = async ({
  id,
  body,
}: {
  id: number;
  body: Partial<Product>;
}) => {
  return await patchProductRepository({ id, ...body });
};

export const deleteProductService = async ({ id }: ParsedProductIdParam) => {
  return await deleteProductRepository({ id });
};
