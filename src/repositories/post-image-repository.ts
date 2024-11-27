import { Prisma } from "@prisma/client";

import prisma from "./prisma";
import { PostImageCreateInput } from "../types/post-image-types";

async function createManyData(
  data: PostImageCreateInput[]
): Promise<{ count: number }> {
  return await prisma.postImage.createMany({ data });
}

async function deleteManyData(
  where: Prisma.PostImageWhereInput
): Promise<void> {
  await prisma.postImage.deleteMany({ where });
}

export default {
  createManyData,
  deleteManyData,
};
