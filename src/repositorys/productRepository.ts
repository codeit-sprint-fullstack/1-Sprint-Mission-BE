import prisma from "../models/index";
import { Product, Prisma } from "@prisma/client";

interface CustomProductCreateInput {
  ownerId: number;
  ownerNickname: string;
  images: string[];
  name: string;
  price: number;
  description: string;
  tags: string[];
}

export const createProduct = async (
  data: CustomProductCreateInput
): Promise<Product> => {
  return prisma.product.create({ data });
};

export const findMany = async (
  whereCondition: Prisma.ProductWhereInput,
  orderCondition: Prisma.ProductOrderByWithRelationInput[],
  offset: number,
  pageSize: number
): Promise<[Product[], number]> => {
  return prisma.$transaction([
    prisma.product.findMany({
      where: whereCondition,
      skip: offset,
      take: pageSize,
      orderBy: orderCondition,
    }),
    prisma.product.count({ where: whereCondition }),
  ]);
};

export const findUnique = async (
  productId: number,
  userId: number
): Promise<Product | null> => {
  return prisma.product.findUnique({
    where: { id: productId },
    include: {
      favorites: {
        where: { userId },
        select: { id: true },
      },
    },
  });
};

export const updateProduct = async (
  productId: number,
  data: CustomProductCreateInput
): Promise<Product> => {
  return prisma.product.update({
    where: { id: productId },
    data,
  });
};

export const deleteProduct = async (productId: number): Promise<void> => {
  await prisma.product.delete({ where: { id: productId } });
};

export const findFavorite = async (productId: number, userId: number) => {
  return prisma.favorite.findFirst({
    where: { productId, userId },
  });
};

export const updateFavoriteTransaction = async (
  productId: number,
  userId: number,
  increment: boolean,
  existingFavoriteId?: number
) => {
  const favoriteAction = increment ? { increment: 1 } : { decrement: 1 };

  return prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: { favoriteCount: favoriteAction },
    }),
    increment
      ? prisma.favorite.create({
          data: { productId, userId },
        })
      : prisma.favorite.delete({
          where: { id: existingFavoriteId },
        }),
  ]);
};
