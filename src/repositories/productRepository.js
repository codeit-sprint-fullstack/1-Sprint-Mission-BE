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
    },
  });

  return products;
}

export async function getTotalCount(searchQuery) {
  const totalCount = await prisma.product.count({ where: searchQuery });
  return totalCount;
}

export async function getById(id) {
  const product = await prisma.product.findUniqueOrThrow({
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

export async function create(data) {
  const newProduct = await prisma.product.create({
    data: { ...data },
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

export async function fineFavoriteUser({ productId, userId }) {
  const hasUserAddFavoriteToProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      favoriteUsers: { some: { userId } },
    },
  });

  return hasUserAddFavoriteToProduct;
}

export async function addFavorite({ productId, currentFavoriteCount, userId }) {
  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
      favoriteCount: currentFavoriteCount,
    },
    data: {
      favoriteUsers: { connect: { userId } },
      favoriteCount: { increment: 1 },
    },
    select: {
      ...PRODUCT_FIELDS,
    },
    writer: {
      select: {
        ...OWNER_FIELDS,
      },
    },
  });
  return updatedProduct;
}

export async function removeFavorite({
  productId,
  currentFavoriteCount,
  userId,
}) {
  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
      favoriteCount: currentFavoriteCount,
    },
    data: {
      favoriteUsers: { disconnect: { userId } },
      favoriteCount: { decrement: 1 },
    },
    select: {
      ...PRODUCT_FIELDS,
    },
    writer: {
      select: {
        ...OWNER_FIELDS,
      },
    },
  });
  return updatedProduct;
}
