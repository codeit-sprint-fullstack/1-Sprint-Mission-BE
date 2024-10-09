import prisma from "../models/index.js";

const parseId = (id) => parseInt(id, 10);

// 상품 생성
export const createProduct = async (
  images,
  name,
  price,
  description,
  tags,
  userId,
  userNickname
) => {
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

// 상품 목록 조회
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
    orderBy === "favorite"
      ? { favoriteCount: "desc", createdAt: "desc" }
      : { createdAt: "desc" };

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

// 특정 상품 조회
export const getProductById = async (productId, userId) => {
  const product = await prisma.product.findUnique({
    where: { id: parseId(productId) },
    include: {
      favorites: {
        where: { userId: parseId(userId) },
        select: { id: true },
      },
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const isFavorite = product.favorites.length > 0;

  return {
    ...product,
    isFavorite,
  };
};

// 상품 업데이트
export const updateProduct = async (
  productId,
  images,
  name,
  price,
  description,
  tags
) => {
  const updatedProduct = await prisma.product.update({
    where: { id: parseId(productId) },
    data: {
      images,
      name,
      price,
      description,
      tags,
    },
  });

  return updatedProduct;
};

export const deleteProduct = async (productId) => {
  await prisma.product.delete({ where: { id: parseId(productId) } });
};

const updateFavorite = async (productId, increment = true, userId) => {
  const existingFavorite = await prisma.favorite.findFirst({
    where: { productId: parseId(productId), userId: parseId(userId) },
  });

  if (increment && existingFavorite) {
    throw new Error("이미 좋아요를 눌렀습니다.");
  } else if (!increment && !existingFavorite) {
    throw new Error("좋아요를 누르지 않았습니다.");
  }

  const favoriteAction = increment ? { increment: 1 } : { decrement: 1 };

  const [updatedProduct, favoriteActionResult] = await prisma.$transaction([
    prisma.product.update({
      where: { id: parseId(productId) },
      data: { favoriteCount: favoriteAction },
    }),
    increment
      ? prisma.favorite.create({
          data: { productId: parseId(productId), userId: parseId(userId) },
        })
      : prisma.favorite.delete({
          where: { id: existingFavorite.id },
        }),
  ]);

  return { updatedProduct, favoriteActionResult };
};

export const addFavorite = async (productId, userId) => {
  return updateFavorite(productId, true, userId);
};

export const deleteFavorite = async (productId, userId) => {
  return updateFavorite(productId, false, userId);
};
