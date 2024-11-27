import { Prisma } from "@prisma/client";

import prisma from "./prisma";
import { ProductImageCreateInput } from "../types/product-image-types";

async function createManyData(
  data: ProductImageCreateInput[]
): Promise<{ count: number }> {
  return await prisma.productImage.createMany({ data });
}

async function deleteManyData(
  where: Prisma.ProductImageWhereInput
): Promise<void> {
  await prisma.productImage.deleteMany({ where });
}

export default {
  createManyData,
  deleteManyData,
};
