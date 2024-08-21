// models/Product_prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProduct = async (data) => {
  return await prisma.product.create({ data });
};

export const getProductById = async (id) => {
  return await prisma.product.findUnique({ where: { id: Number(id) } });
};

export const updateProduct = async (id, data) => {
  return await prisma.product.update({ where: { id: Number(id) }, data });
};

export const deleteProduct = async (id) => {
  return await prisma.product.delete({ where: { id: Number(id) } });
};

export const getProducts = async (options) => {
  return await prisma.product.findMany(options);
};
