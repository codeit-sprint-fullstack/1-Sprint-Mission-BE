import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { PagenationParamsByPage } from "../types/repository-type";

type ProductSelectType = Prisma.ProductSelect;

type ProductPayLoad<T extends ProductSelectType | undefined> =
  Prisma.ProductGetPayload<{ select: T }>;

interface PagenationParams extends PagenationParamsByPage {
  where?: Prisma.ProductWhereInput;
}

// findManyByPagenationData
function findManyByPagenationData<T extends ProductSelectType>({
  pagenationParams,
  select,
}: {
  pagenationParams: PagenationParams;
  select: T;
}): Promise<ProductPayLoad<T>[]>;
function findManyByPagenationData({
  pagenationParams,
}: {
  pagenationParams: PagenationParams;
}): Promise<ProductPayLoad<undefined>[]>;

async function findManyByPagenationData<
  T extends ProductSelectType | undefined
>({
  pagenationParams,
  select,
}: {
  pagenationParams: PagenationParams;
  select?: T;
}) {
  const { orderBy, skip, take, where } = pagenationParams;
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

// findUniqueOrThrowtData
function findUniqueOrThrowtData<T extends ProductSelectType>({
  where,
  select,
}: {
  where: Prisma.ProductWhereUniqueInput;
  select: T;
}): Promise<ProductPayLoad<T>>;
function findUniqueOrThrowtData({
  where,
}: {
  where: Prisma.ProductWhereUniqueInput;
}): Promise<ProductPayLoad<undefined>>;

async function findUniqueOrThrowtData<T extends ProductSelectType | undefined>({
  where,
  select,
}: {
  where: Prisma.ProductWhereUniqueInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.product.findUniqueOrThrow({ where });
  }
  return await prisma.product.findUniqueOrThrow({ where, select });
}

// updateData
function updateData<T extends ProductSelectType>({
  where,
  data,
  select,
}: {
  where: Prisma.ProductWhereUniqueInput;
  data: Prisma.ProductUpdateInput;
  select: T;
}): Promise<ProductPayLoad<T>>;
function updateData({
  where,
  data,
}: {
  where: Prisma.ProductWhereUniqueInput;
  data: Prisma.ProductUpdateInput;
}): Promise<ProductPayLoad<undefined>>;

async function updateData<T extends ProductSelectType | undefined>({
  where,
  data,
  select,
}: {
  where: Prisma.ProductWhereUniqueInput;
  data: Prisma.ProductUpdateInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.product.update({ where, data });
  }
  return await prisma.product.update({ where, data, select });
}

export default {
  findManyByPagenationData,
  countData,
  createData,
  findUniqueOrThrowtData,
  updateData,
};
