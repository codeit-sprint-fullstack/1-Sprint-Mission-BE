import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { PagenationParams } from "../types/repository-type";

type ProductSelectType = Prisma.ProductSelect;

type ProductPayLoad<T extends ProductSelectType | undefined> =
  Prisma.ProductGetPayload<{ select: T }>;

interface ProductPagenationParams extends PagenationParams {
  where?: Prisma.ProductWhereInput;
}

// findManyByPaginationData
function findManyByPaginationData<T extends ProductSelectType>({
  paginationParams,
  select,
}: {
  paginationParams: ProductPagenationParams;
  select: T;
}): Promise<ProductPayLoad<T>[]>;
function findManyByPaginationData({
  paginationParams,
}: {
  paginationParams: ProductPagenationParams;
}): Promise<ProductPayLoad<undefined>[]>;

async function findManyByPaginationData<
  T extends ProductSelectType | undefined
>({
  paginationParams,
  select,
}: {
  paginationParams: ProductPagenationParams;
  select?: T;
}) {
  const { orderBy, skip, take, where } = paginationParams;
  if (select === undefined) {
    return await prisma.product.findMany({ orderBy, skip, take, where });
  }
  return await prisma.product.findMany({ orderBy, skip, take, where, select });
}

// countData
async function countData(where: Prisma.ProductWhereInput): Promise<number> {
  return await prisma.product.count({ where });
}

// createData
function createData<T extends ProductSelectType>({
  data,
  select,
}: {
  data: Prisma.ProductUncheckedCreateInput;
  select: T;
}): Promise<ProductPayLoad<T>>;
function createData({
  data,
}: {
  data: Prisma.ProductUncheckedCreateInput;
}): Promise<ProductPayLoad<undefined>>;

async function createData<T extends ProductSelectType | undefined>({
  data,
  select,
}: {
  data: Prisma.ProductUncheckedCreateInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.product.create({ data });
  }
  return await prisma.product.create({ data, select });
}

export default {
  findManyByPaginationData,
  countData,
  createData
};
