import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { CommentPagenationParams } from "../types/repository-type";

type CommentSelectType = Prisma.CommentSelect;

type CommentPayLoad<T extends CommentSelectType | undefined> =
  Prisma.CommentGetPayload<{ select: T }>;

interface PagenationParams extends CommentPagenationParams {
  where?: Prisma.CommentWhereInput;
}

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

async function countData(where: Prisma.CommentWhereInput): Promise<number> {
  return await prisma.comment.count({ where });
}

export default {
  findManyByCursorPagenationData,
  countData,
};
