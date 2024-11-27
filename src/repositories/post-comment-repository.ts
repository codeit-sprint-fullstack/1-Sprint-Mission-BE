import { Prisma, PostComment } from "@prisma/client";

import prisma from "./prisma";
import {
  PostCommentCreateDataParam,
  PostCommentFindUniqueOrThrowDataParam,
  PostCommentFindManyByPaginationParam,
  PostCommentUpdateDataParam,
} from "../types/post-comment-types";

async function createData<TSelect extends Prisma.PostCommentSelect>({
  data,
  select,
}: {
  data: Prisma.PostCommentCreateInput;
  select: TSelect;
}): Promise<Prisma.PostCommentGetPayload<{ select: TSelect }>> {
  return await prisma.postComment.create({ data, select });
}

async function findUniqueOrThrowData<TSelect extends Prisma.PostCommentSelect>({
  where,
  select,
}: {
  where: Prisma.PostCommentWhereUniqueInput;
  select: TSelect;
}): Promise<Prisma.PostCommentGetPayload<{ select: TSelect }>> {
  return await prisma.postComment.findUniqueOrThrow({ where, select });
}

async function countData(where: Prisma.PostCommentWhereInput): Promise<number> {
  return await prisma.postComment.count({ where });
}

async function findManyByPaginationData({
  orderBy,
  skip,
  take,
  where,
  select,
}: PostCommentFindManyByPaginationParam): Promise<Partial<PostComment>[]> {
  return await prisma.postComment.findMany({
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
}: PostCommentUpdateDataParam): Promise<Partial<PostComment>> {
  return await prisma.postComment.update({ where, data, select });
}

async function deleteData(
  where: Prisma.PostCommentWhereUniqueInput
): Promise<void> {
  await prisma.postComment.delete({ where });
}

export default {
  createData,
  countData,
  findManyByPaginationData,
  findUniqueOrThrowData,
  updateData,
  deleteData,
};
