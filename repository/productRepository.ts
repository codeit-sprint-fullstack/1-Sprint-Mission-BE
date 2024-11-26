import { PrismaClient, Prisma, Product } from "@prisma/client";
import {
  ParsedProductIdParam,
  ParsedProductListParams,
  ProductCreate,
  ProductSearchParam,
} from "../dto/product.dto.js";

const prisma = new PrismaClient();

export const getProductRepository = async ({ id }: ParsedProductIdParam) => {
  return await prisma.product.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      images: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
      like: true,
    },
  });
};

export const getProductListRepository = async (
  params: ParsedProductListParams
) => {
  const { offset, limit, order, search } = params;

  let orderBy: Prisma.ProductOrderByWithRelationInput;
  switch (order) {
    case "old":
      orderBy = { createdAt: "desc" };
      break;
    case "recent":
      orderBy = { createdAt: "asc" };
      break;
    default:
      orderBy = { createdAt: "asc" };
  }
  return await prisma.product.findMany({
    skip: offset,
    take: limit,
    orderBy,
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      images: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
      like: true,
    },
  });
};

export const getProductTotalCountRepository = async ({
  search,
}: ProductSearchParam) => {
  return await prisma.product.count({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    },
  });
};

export const postProductRepository = async ({
  name,
  description,
  price,
  tags,
  imageUrls,
}: ProductCreate) => {
  return await prisma.product.create({
    data: { name, description, price, tags, images: imageUrls },
  });
};

export const patchProductRepository = async ({
  id,
  ...body
}: ParsedProductIdParam & Partial<Product>) => {
  return await prisma.product.update({
    where: { id },
    data: body,
  });
};

export const deleteProductRepository = async ({ id }: ParsedProductIdParam) => {
  await prisma.product.delete({
    where: { id },
  });
};
