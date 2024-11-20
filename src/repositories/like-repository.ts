import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";

type LikeSelectType = Prisma.LikeSelect;

type LikePayLoad<T extends LikeSelectType | undefined> = Prisma.LikeGetPayload<{
  select: T;
}>;

// findFirstData
function findFirstData<T extends LikeSelectType>({
  where,
  select,
}: {
  where: Prisma.LikeWhereInput;
  select: T;
}): Promise<LikePayLoad<T> | null>;
function findFirstData({
  where,
}: {
  where: Prisma.LikeWhereInput;
}): Promise<LikePayLoad<undefined> | null>;

async function findFirstData<T extends LikeSelectType | undefined>({
  where,
  select,
}: {
  where: Prisma.LikeWhereInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.like.findFirst({ where });
  }
  return await prisma.like.findFirst({
    where,
    select,
  });
}

// createData
function createData<T extends LikeSelectType>({
  data,
  select,
}: {
  data: Prisma.LikeUncheckedCreateInput;
  select: T;
}): Promise<LikePayLoad<T>>;
function createData({
  data,
}: {
  data: Prisma.LikeUncheckedCreateInput;
}): Promise<LikePayLoad<undefined>>;

async function createData<T extends LikeSelectType | undefined>({
  data,
  select,
}: {
  data: Prisma.LikeUncheckedCreateInput;
  select?: T;
}) {
  if (select === undefined) {
    return await prisma.like.create({ data });
  }
  return await prisma.like.create({
    data,
    select,
  });
}

// countData
async function countData(where: Prisma.LikeWhereInput): Promise<number> {
  return await prisma.like.count({ where });
}

// deleteData
async function deleteData(where: { id: string }): Promise<void> {
  await prisma.like.delete({ where });
}

export default {
  findFirstData,
  createData,
  countData,
  deleteData,
};
