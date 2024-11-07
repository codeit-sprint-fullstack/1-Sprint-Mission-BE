import prisma from "../config/prisma";
import { PagenationParams } from "../types/repository-type";
import { Prisma } from "@prisma/client";

type ArticleSelectType = Prisma.ArticleSelect;

// ~~~GetPayload<>: select 또는 include 옵션의 구조에 따라 반환 타입을 동적으로 생성
type ArticlePayload<T extends ArticleSelectType | undefined> =
  Prisma.ArticleGetPayload<{ select: T }>;

interface ArticlePagenationParams extends PagenationParams {
  where?: Prisma.ArticleWhereInput;
}

// createData
// 함수 오버로드의 시크니쳐
function createData<T extends ArticleSelectType>({
  // T를 Prisma.ArticleSelect 구조로 제한
  data,
  select,
}: {
  data: Prisma.ArticleUncheckedCreateInput;
  select: T;
}): Promise<ArticlePayload<T>>;
// Promise<>: 비동기 함수가 반환하는 값을 명시적으로 지정할 때 사용,

// 함수 오버로드의 시크니쳐
function createData({
  data,
}: {
  data: Prisma.ArticleUncheckedCreateInput;
}): Promise<ArticlePayload<undefined>>;

// 함수 오버로드의 구현부
async function createData<T extends ArticleSelectType | undefined>({
  data,
  select,
}: {
  data: Prisma.ArticleUncheckedCreateInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.article.create({ data });
  }
  return await prisma.article.create({
    data,
    select,
  });
}

// findFirstData
function findFirstData<T extends ArticleSelectType>({
  where,
  select,
}: {
  where: Prisma.ArticleWhereInput;
  select: T;
}): Promise<ArticlePayload<T> | null>;
function findFirstData({
  where,
}: {
  where: Prisma.ArticleWhereInput;
}): Promise<ArticlePayload<undefined> | null>;

async function findFirstData<T extends ArticleSelectType | undefined>({
  where,
  select,
}: {
  where: Prisma.ArticleWhereInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.article.findFirst({ where });
  }
  return await prisma.article.findFirst({
    where,
    select,
  });
}

// findUniqueOrThrowtData
function findUniqueOrThrowtData<T extends ArticleSelectType>({
  where,
  select,
}: {
  where: Prisma.ArticleWhereUniqueInput;
  select: T;
}): Promise<ArticlePayload<T>>;
function findUniqueOrThrowtData({
  where,
}: {
  where: Prisma.ArticleWhereUniqueInput;
}): Promise<ArticlePayload<undefined>>;

async function findUniqueOrThrowtData<T extends ArticleSelectType | undefined>({
  where,
  select,
}: {
  where: Prisma.ArticleWhereUniqueInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.article.findUniqueOrThrow({ where });
  }
  return await prisma.article.findUniqueOrThrow({ where, select });
}

// countData
async function countData(where: Prisma.ArticleWhereInput): Promise<number> {
  return await prisma.article.count({ where });
}

// findManyByPaginationData
function findManyByPaginationData<T extends ArticleSelectType>({
  paginationParams,
  select,
}: {
  paginationParams: ArticlePagenationParams;
  select: T;
}): Promise<ArticlePayload<T>[]>;
function findManyByPaginationData({
  paginationParams,
}: {
  paginationParams: ArticlePagenationParams;
}): Promise<ArticlePayload<undefined>[]>;

async function findManyByPaginationData<
  T extends ArticleSelectType | undefined
>({
  paginationParams,
  select,
}: {
  paginationParams: ArticlePagenationParams;
  select?: T;
}) {
  const { orderBy, skip, take, where } = paginationParams;
  if (select === undefined) {
    return await prisma.article.findMany({ orderBy, skip, take, where });
  }
  return await prisma.article.findMany({ orderBy, skip, take, where, select });
}

// updateData
function updateData<T extends ArticleSelectType>({
  where,
  data,
  select,
}: {
  where: Prisma.ArticleWhereUniqueInput;
  data: Prisma.ArticleUpdateInput;
  select: T;
}): Promise<ArticlePayload<T>>;
function updateData({
  where,
  data,
}: {
  where: Prisma.ArticleWhereUniqueInput;
  data: Prisma.ArticleUpdateInput;
}): Promise<ArticlePayload<undefined>>;

async function updateData<T extends ArticleSelectType | undefined>({
  where,
  data,
  select,
}: {
  where: Prisma.ArticleWhereUniqueInput;
  data: Prisma.ArticleUpdateInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.article.update({ where, data });
  }
  return await prisma.article.update({ where, data, select });
}

// deleteData
async function deleteData(where: { id: string }): Promise<void> {
  await prisma.article.delete({ where });
}

export default {
  createData,
  findFirstData,
  findUniqueOrThrowtData,
  countData,
  findManyByPaginationData,
  updateData,
  deleteData,
};
