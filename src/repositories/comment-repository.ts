import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { CommentPagenationParams } from "../types/repository-type";

type CommentSelectType = Prisma.CommentSelect;

type CommentPayLoad<T extends CommentSelectType | undefined> =
  Prisma.CommentGetPayload<{ select: T }>;

interface PagenationParams extends CommentPagenationParams {
  where?: Prisma.CommentWhereInput;
}

// findManyByCursorPagenationData
function findManyByCursorPagenationData<T extends CommentSelectType>({
  pagenationParams,
  select,
}: {
  pagenationParams: PagenationParams;
  select: T;
}): Promise<CommentPayLoad<T>[]>;
function findManyByCursorPagenationData({
  pagenationParams,
}: {
  pagenationParams: PagenationParams;
}): Promise<CommentPayLoad<undefined>[]>;

async function findManyByCursorPagenationData<
  T extends CommentSelectType | undefined
>({
  pagenationParams,
  select,
}: {
  pagenationParams: PagenationParams;
  select?: T;
}) {
  const { orderBy, take, cursor, where } = pagenationParams;
  if (select === undefined) {
    return await prisma.comment.findMany({ orderBy, take, cursor, where });
  }
  return await prisma.comment.findMany({
    orderBy,
    take,
    cursor,
    where,
    select,
  });
}

// countData
async function countData(where: Prisma.CommentWhereInput): Promise<number> {
  return await prisma.comment.count({ where });
}

// createData
function createData<T extends CommentSelectType>({
  data,
  select,
}: {
  data: Prisma.CommentUncheckedCreateInput;
  select: T;
}): Promise<CommentPayLoad<T>>;
function createData({
  data,
}: {
  data: Prisma.CommentUncheckedCreateInput;
}): Promise<CommentPayLoad<undefined>>;

async function createData<T extends CommentSelectType | undefined>({
  data,
  select,
}: {
  data: Prisma.CommentUncheckedCreateInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.comment.create({ data });
  }
  return await prisma.comment.create({ data, select });
}

export default {
  findManyByCursorPagenationData,
  countData,
  createData,
};
