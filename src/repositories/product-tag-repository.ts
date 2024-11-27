import { Prisma } from "@prisma/client";

import prisma from "./prisma";
import { ProductTagCreateInput } from "../types/product-tag-types";

async function createManyData(
  data: ProductTagCreateInput[]
): Promise<{ count: number }> {
  return await prisma.productTag.createMany({ data });
}

async function deleteManyData(
  where: Prisma.ProductTagWhereInput
): Promise<void> {
  await prisma.productTag.deleteMany({ where });
}

export default {
  createManyData,
  deleteManyData,
};
