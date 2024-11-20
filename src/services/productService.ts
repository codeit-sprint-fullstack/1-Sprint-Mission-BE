import prisma from "../models/index";
import { Product, Prisma } from "@prisma/client";

interface User_Product {
  productId: string | number;
  userId: string | number;
}

interface ProductParams {
  images: string[] | undefined;
  name: string | undefined;
  price: number;
  description: string | undefined;
  tags: string[] | undefined;
  userId: number;
  userNickname: string;
}

interface UpdateProductParams extends ProductParams {
  productId: string | number;
}

const parseId = (id: string | number): number => parseInt(id.toString(), 10);

// 상품 생성
export const createProduct = async ({
  images,
  name,
  price,
  description,
  tags,
  userId,
  userNickname,
}: ProductParams): Promise<Product> => {
  const newProduct = await prisma.product.create({
    data: {
      images: images ?? [],
      name: name ?? "",
      price,
      description: description ?? "",
      tags: tags ?? [],
      ownerId: userId,
      ownerNickname: userNickname,
    },
  });

  return newProduct;
};

// 상품 목록 조회
export const getProducts = async (
  page: number = 1,
  pageSize: number = 10,
  keyword: string = "",
  orderBy: string = "recent"
): Promise<{
  list: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
}> => {
  const offset = (page - 1) * pageSize;

  const whereCondition: Prisma.ProductWhereInput = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const orderCondition: Prisma.ProductOrderByWithRelationInput[] =
    orderBy === "favorite"
      ? [{ favoriteCount: "desc" }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }];

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
export const getProductById = async ({
  productId,
  userId,
}: User_Product): Promise<Product & { isFavorite: boolean }> => {
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
export const updateProduct = async ({
  productId,
  images,
  name,
  price,
  description,
  tags,
  userId,
  userNickname,
}: UpdateProductParams): Promise<Product> => {
  const updatedProduct = await prisma.product.update({
    where: { id: parseId(productId) },
    data: {
      images: images || [],
      name: name || "",
      price,
      description: description || "",
      tags: tags || [],
      ownerId: userId,
      ownerNickname: userNickname,
    },
  });

  return updatedProduct;
};

export const deleteProduct = async (
  productId: string | number
): Promise<void> => {
  await prisma.product.delete({ where: { id: parseId(productId) } });
};

const updateFavorite = async (
  productId: string | number,
  increment: boolean = true,
  userId: string | number
): Promise<{ updatedProduct: Product; favoriteActionResult: any }> => {
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
          where: { id: existingFavorite!.id },
        }),
  ]);

  return { updatedProduct, favoriteActionResult };
};

export const addFavorite = async ({
  productId,
  userId,
}: User_Product): Promise<{
  updatedProduct: Product;
  favoriteActionResult: any;
}> => {
  return updateFavorite(productId, true, userId);
};

export const deleteFavorite = async ({
  productId,
  userId,
}: User_Product): Promise<{
  updatedProduct: Product;
  favoriteActionResult: any;
}> => {
  return updateFavorite(productId, false, userId);
};
