import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProductRepository = async ({ id }) => {
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
      favoriteCount: true,
    },
  });
};

export const getProductListRepository = async ({
  offset,
  limit,
  order,
  search,
}) => {
  let orderBy;
  switch (order) {
    case 'old':
      orderBy = { createdAt: 'desc' };
      break;
    case 'recent':
      orderBy = { createdAt: 'asc' };
      break;
    case 'favorite':
      orderBy = { favoriteCount: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'asc' };
  }
  return await prisma.product.findMany({
    skip: parseInt(offset),
    take: parseInt(limit),
    orderBy,
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
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
      favoriteCount: true,
    },
  });
};

export const postProductRepository = async ({
  name,
  description,
  price,
  tags,
}) => {
  return await prisma.product.create({
    data: { name, description, price, tags },
  });
};

export const patchProductRepository = async ({ id }) => {
  return await prisma.product.update({
    where: { id },
    data: req.body,
  });
};

export const deleteProductRepository = async ({ id }) => {
  return prisma.product.delete({
    where: { id },
  });
};
