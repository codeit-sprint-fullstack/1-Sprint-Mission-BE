import prisma from "../models/index.js";

// 상품 생성 서비스 함수
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

// 상품 목록 조회 서비스 함수
export const getProducts = async (
  page = 1,
  pageSize = 10,
  keyword = "",
  orderBy = "recent"
) => {
  const offset = (page - 1) * pageSize;

  // 키워드 검색 조건 설정
  const whereCondition = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  // 정렬 조건 설정
  let orderCondition;
  if (orderBy === "favorite") {
    orderCondition = { favoriteCount: "desc" };
  } else {
    orderCondition = { createdAt: "desc" };
  }

  const [list, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      where: whereCondition,
      skip: offset,
      take: pageSize,
      orderBy: orderCondition,
    }),
    prisma.product.count({
      where: whereCondition,
    }),
  ]);

  return { list, totalCount, page, pageSize };
};

export const getProductById = async (productId) => {
  return prisma.product.findUnique({
    where: { id: parseInt(productId) },
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
  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(productId) },
    data: {
      name: name,
      price: price,
      description: description,
      images: images,
      tags: tags,
    },
  });

  return updatedProduct;
};

export const deleteProduct = async (productId) => {
  await prisma.product.delete({ where: { id: parseInt(productId) } });
};

export const addFavorite = async (productId) => {
  const addFavorite = await prisma.product.update({
    where: { id: parseInt(productId) },
    data: {
      favoriteCount: { increment: 1 },
      isFavorite: true,
    },
  });
  return addFavorite;
};

export const deleteFavorite = async (productId) => {
  const deleteFavorite = await prisma.product.update({
    where: { id: parseInt(productId) },
    data: {
      favoriteCount: { decrement: 1 },
      isFavorite: false,
    },
  });
  return deleteFavorite;
};
