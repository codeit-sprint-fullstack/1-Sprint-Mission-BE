import productCommentRepository from "../repositories/product-comment-repository";

import {
  CreateProductCommentParam,
  GetProductCommentListParam,
  ModifyProductCommentParam,
  ProductCommentBaseInfo,
  ProductCommentListInfo,
  ProductCommentData,
} from "../types/product-comment-types";
import { productCommentSelect } from "./selectors/product-comment-select";
import {
  productCommentMapper,
  productCommentListMapper,
} from "./mappers/product-comment-mapper";

import { ORDER_BY, DEFAULT_ORDER_BY } from "../constants/sort";
import { DEFAULT_POST_TAKE } from "../constants/post";

async function createProductComment({
  userId,
  productId,
  content,
}: CreateProductCommentParam): Promise<ProductCommentBaseInfo> {
  const data = {
    User: {
      connect: { id: userId },
    },
    Product: {
      connect: { id: productId },
    },
    content,
  };
  const result = (await productCommentRepository.createData({
    data,
    select: productCommentSelect,
  })) as ProductCommentData;

  return productCommentMapper(result);
}

async function getProductCommentList({
  productId,
  orderBy,
  page,
  pageSize,
}: GetProductCommentListParam): Promise<ProductCommentListInfo> {
  const ProductCommentOrderBy = ORDER_BY[orderBy] || DEFAULT_ORDER_BY;
  const where = { productId };
  const iPage: number = parseInt(page as unknown as string) || 1;
  const iPageSize: number =
    parseInt(pageSize as unknown as string) || DEFAULT_POST_TAKE;
  const skip: number = (iPage - 1) * iPageSize;
  const take: number = iPageSize;
  const count: number = await productCommentRepository.countData(where);
  const productCommentList =
    (await productCommentRepository.findManyByPaginationData({
      orderBy: ProductCommentOrderBy,
      skip,
      take,
      where,
      select: productCommentSelect,
    })) as ProductCommentData[];

  return productCommentListMapper({ count, productCommentList });
}

async function getProductComment(
  productCommentId: string
): Promise<ProductCommentBaseInfo> {
  const where = {
    id: productCommentId,
  };

  const result = (await productCommentRepository.findUniqueOrThrowData({
    where,
    select: productCommentSelect,
  })) as ProductCommentData;

  return productCommentMapper(result);
}

async function modifyProductComment({
  productCommentId,
  content,
}: ModifyProductCommentParam): Promise<ProductCommentBaseInfo> {
  const where = {
    id: productCommentId,
  };
  const data = { content };

  const result = (await productCommentRepository.updateData({
    where,
    data,
    select: productCommentSelect,
  })) as ProductCommentData;

  return productCommentMapper(result);
}

async function deleteProductComment(productCommentId: string): Promise<void> {
  const where = { id: productCommentId };

  return await productCommentRepository.deleteData(where);
}

export default {
  createProductComment,
  getProductCommentList,
  getProductComment,
  modifyProductComment,
  deleteProductComment,
};
