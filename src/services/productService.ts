import { Request } from "express";
import productRepository from "../repositorys/productRepository";
import { setOrderByQuery } from "../utils/orderByQuery";
import { CustomError } from "../utils/interfaces/customError";
import { whereConditions } from "../utils/interfaces/whereConditions";
import { ProductData } from "../utils/interfaces/products/productData";
import offsetQueryString from "../utils/queryString/offsetQueryString";

const getProducts = async (req: Request) => {
  const query = req.query as unknown as offsetQueryString;
  const {
    orderBy = "recent", // 기본값
    page = "1",
    pageSize = "10",
    keyword = "",
  }: offsetQueryString = query;
  const parsePage = parseInt(page);
  const parsePageSize = parseInt(pageSize);
  const offset = (parsePage - 1) * parsePageSize; //page가 3이면 3-1 = 2 * count 만큼 스킵
  const orderOption = setOrderByQuery(orderBy);
  const whereConditions: whereConditions = {};
  if (keyword) {
    whereConditions.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }
  const [totalCount, products] = await Promise.all([
    productRepository.getTotalCount(whereConditions),
    productRepository.getList(
      parsePageSize,
      offset,
      orderOption,
      whereConditions
    ),
  ]);
  const hasMore = totalCount - parsePage * parsePageSize > 0;
  return { totalCount, products, hasMore };
};

const getProduct = async (userId: string, productId: string) => {
  const product = await productRepository.getById(productId);
  if (!product) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.message = "상품을 찾지 못했습니다.";
    throw error;
  }
  //현재 사용자의 좋아요 상태를 확인 후 반환 -> 좋아요 상태가 아니면 null
  const existingLike = await productRepository.existingLike(userId, productId);
  return { product, existingLike };
};

const createProduct = async (data: ProductData) => {
  const product = await productRepository.create(data);
  if (!product) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.message = "상품을 찾지 못했습니다.";
    throw error;
  }
  return product;
};

const updateProduct = async (id: string, data: ProductData) => {
  const product = await productRepository.update(id, data);
  if (!product) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.message = "상품을 찾지 못했습니다.";
    throw error;
  }
  return product;
};

const likeProduct = async (userId: string, productId: string) => {
  const product = await productRepository.likeProduct(productId, userId);
  return product;
};

const unlikeProduct = async (userId: string, productId: string) => {
  const product = await productRepository.unlikeProduct(productId, userId);
  return product;
};

const deleteProduct = async (id: string) => {
  const product = await productRepository.deleteItem(id);
  if (!product) {
    const error: CustomError = new Error("Not found");
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
