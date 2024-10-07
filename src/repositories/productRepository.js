import prisma from "../config/prisma.js";
import { OWNER_FIELDS, PRODUCT_FIELDS } from "../config/fieldOptions.js";

export async function getAll({ searchQuery, sortOption, offset, pageSize }) {
  const products = await prisma.product.findMany({
    where: searchQuery,
    orderBy: sortOption,
    skip: offset,
    take: pageSize,
    select: {
      ...PRODUCT_FIELDS,
      owner: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  });

  return products;
}

export async function getTotalCount(searchQuery) {
  const totalCount = await prisma.product.count({ where: searchQuery });
  return totalCount;
}

export async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      ...PRODUCT_FIELDS,
      owner: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  });

  return product;
}

export async function create(userId, data) {
  const newProduct = await prisma.product.create({
    data: {
      ...data,
      owner: {
        connect: { id: userId },
      },
    },
    select: {
      ...PRODUCT_FIELDS,
      owner: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  });
  return newProduct;
}

export async function updateById(id, data) {
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...data,
    },
    select: {
      ...PRODUCT_FIELDS,
      owner: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  });
  return updatedProduct;
}

export async function deleteById(id) {
  await prisma.product.delete({ where: { id } });
}

export async function fineFavoriteUser(tx, { productId, userId }) {
  const hasUserFavorite = await tx.product.findFirst({
    where: {
      id: productId,
      favoriteUsers: { some: { userId } },
    },
  });

  return hasUserFavorite;
}

export async function findFavoriteCount(tx, productId) {
  const product = await tx.product.findUnique({
    where: { id: productId },
    select: {
      favoriteCount: true,
    },
  });

  return product.favoriteCount;
}

export async function updateFavoriteStatus(
  tx,
  { productId, currentFavoriteCount, userId, updateOption }
) {
  const updatedProduct = await tx.product.update({
    where: {
      id: productId,
      favoriteCount: currentFavoriteCount,
    },
    data: {
      favoriteUsers: { [updateOption]: { id: userId } },
      favoriteCount:
        updateOption === "connect" ? { increment: 1 } : { decrement: 1 },
    },
    select: {
      ...PRODUCT_FIELDS,
      writer: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  });
  return updatedProduct;
}
