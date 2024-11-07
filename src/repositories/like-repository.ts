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

export default {
  findFirstData,
};
