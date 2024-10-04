import prisma from "../models/index.js";

const parseId = (id) => parseInt(id, 10);

const validateTags = (tags) => {
  if (!Array.isArray(tags) || tags.length < 1 || tags.length > 5) {
    throw new Error("태그는 최소 1개, 최대 5개까지 입력 가능합니다.");
  }
};

export const createProduct = async (
  images,
  name,
  price,
  description,
  tags,
  userId,
  userNickname
) => {
  validateTags(tags);

  const newProduct = await prisma.product.create({
    data: {
      images,
      name,
      price,
      description,
      tags,
      ownerId: userId,
      ownerNickname: userNickname,
    },
  });

  return newProduct;
};

export const getProducts = async (
  page = 1,
  pageSize = 10,
  keyword = "",
  orderBy = "recent"
) => {
  const offset = (page - 1) * pageSize;

  const whereCondition = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const orderCondition =
    orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

  const [list, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      where: whereCondition,
      skip: offset,
      take: pageSize,
      orderBy: orderCondition,
    }),
    prisma.product.count({ where: whereCondition }),
  ]);

  return { list, totalCount, page, pageSize };
};

export const getProductById = async (productId) => {
  return prisma.product.findUnique({
    where: { id: parseId(productId) },
  });
};

export const updateProduct = async (
  productId,
  images,
  tags,
  price,
  description,
  name
) => {
  validateTags(tags);

  const updatedProduct = await prisma.product.update({
    where: { id: parseId(productId) },
    data: {
      name,
      price,
      description,
      images,
      tags,
    },
  });

  return updatedProduct;
};

export const deleteProduct = async (productId) => {
  await prisma.product.delete({ where: { id: parseId(productId) } });
};

const updateFavorite = async (productId, increment = true) => {
  const favoriteAction = increment ? { increment: 1 } : { decrement: 1 };
  const isFavorite = increment ? true : false;

  const updatedProduct = await prisma.product.update({
    where: { id: parseId(productId) },
    data: {
      favoriteCount: favoriteAction,
      isFavorite,
    },
  });

  return updatedProduct;
};

export const addFavorite = async (productId) => {
  return updateFavorite(productId, true);
};

export const deleteFavorite = async (productId) => {
  return updateFavorite(productId, false);
};
