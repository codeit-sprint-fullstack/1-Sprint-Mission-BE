import { prisma } from "../utils/prisma.js";

export const createProduct = async (data) => {
  return prisma.product.create({ data });
};

export const getProducts = async (page, limit, order) => {
  const skip = (page - 1) * limit;
  const orderBy = order === "recent" ? { createdAt: "desc" } : { price: "asc" };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: Number(limit),
      orderBy,
    }),
    prisma.product.count(),
  ]);

  return { products, totalCount };
};

export const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
  });
};

export const updateProduct = async (id, data) => {
  return prisma.product.update({
    where: { id: Number(id) },
    data,
  });
};

export const deleteProduct = async (id) => {
  return prisma.product.delete({ where: { id: Number(id) } });
};
