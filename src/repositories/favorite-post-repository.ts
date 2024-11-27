import { Prisma, FavoritePost } from "@prisma/client";

import prisma from "./prisma";
import { FavoritePostCreateDataParam } from "../types/favorite-post-types";

async function createData({
  data,
  select,
}: FavoritePostCreateDataParam): Promise<FavoritePost> {
  return await prisma.favoritePost.create({ data, select });
}

async function countData(
  where: Prisma.FavoritePostWhereInput
): Promise<number> {
  return await prisma.favoritePost.count({ where });
}

async function deleteData(
  where: Prisma.FavoritePostWhereUniqueInput
): Promise<void> {
  await prisma.favoritePost.delete({ where });
}

export default {
  createData,
  countData,
  deleteData,
};
