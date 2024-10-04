import prisma from "../config/prisma";
import { OWNER_FIELDS, PRODUCT_FIELDS } from "../config/fieldOptions";

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
