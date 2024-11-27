import { Prisma, FavoriteProduct } from "@prisma/client";

import prisma from "./prisma";
import { FavoriteProductCreateDataParam } from "../types/favorite-product-types";

async function createData({
  data,
  select,
}: FavoriteProductCreateDataParam): Promise<FavoriteProduct> {
  return await prisma.favoriteProduct.create({ data, select });
}

async function countData(
  where: Prisma.FavoriteProductWhereInput
): Promise<number> {
  return await prisma.favoriteProduct.count({ where });
}

async function deleteData(
  where: Prisma.FavoriteProductWhereUniqueInput
): Promise<void> {
  await prisma.favoriteProduct.delete({ where });
}

export default {
  createData,
  countData,
  deleteData,
};
