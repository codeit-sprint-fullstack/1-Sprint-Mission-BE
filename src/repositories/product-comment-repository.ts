import { Prisma, ProductComment } from "@prisma/client";

import prisma from "./prisma";
import {
  ProductCommentCreateDataParam,
  ProductCommentFindUniqueOrThrowDataParam,
  ProductCommentFindManyByPaginationParam,
  ProductCommentUpdateDataParam,
} from "../types/product-comment-types";

async function createData({
  data,
  select,
}: ProductCommentCreateDataParam): Promise<Partial<ProductComment>> {
  return await prisma.productComment.create({ data, select });
}

async function findUniqueOrThrowData({
  where,
  select,
}: ProductCommentFindUniqueOrThrowDataParam): Promise<Partial<ProductComment>> {
  return await prisma.productComment.findUniqueOrThrow({ where, select });
}

async function countData(
  where: Prisma.ProductCommentWhereInput
): Promise<number> {
  return await prisma.productComment.count({ where });
}

async function findManyByPaginationData({
  orderBy,
  skip,
  take,
  where,
  select,
}: ProductCommentFindManyByPaginationParam): Promise<
  Partial<ProductComment>[]
> {
  return await prisma.productComment.findMany({
    orderBy,
    skip,
    take,
    where,
    select,
  });
}

async function updateData({
  where,
  data,
  select,
}: ProductCommentUpdateDataParam): Promise<Partial<ProductComment>> {
  return await prisma.productComment.update({ where, data, select });
}

async function deleteData(
  where: Prisma.ProductCommentWhereUniqueInput
): Promise<void> {
  await prisma.productComment.delete({ where });
}

export default {
  createData,
  countData,
  findManyByPaginationData,
  findUniqueOrThrowData,
  updateData,
  deleteData,
};
