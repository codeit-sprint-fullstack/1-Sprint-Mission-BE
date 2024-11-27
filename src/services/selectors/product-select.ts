import { Prisma } from "@prisma/client";

import { DEFAULT_COMMENT_TAKE } from "../../constants/product";

export const productSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  favoriteCount: true,
  createdAt: true,
  ProductImage: {
    select: {
      image: true,
    },
  },
  ProductTag: {
    select: {
      tag: true,
    },
  },
  User: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
};

export const productFavoriteSelect = (
  myUserId: string
): Prisma.ProductSelect => ({
  ...productSelect,
  FavoriteProduct: {
    where: {
      userId: myUserId,
    },
    select: {
      id: true,
    },
  },
});

export const productDetailSelect = (
  myUserId: string
): Prisma.ProductSelect => ({
  ...productFavoriteSelect(myUserId),
  ProductComment: {
    orderBy: { createdAt: "asc" },
    skip: 0,
    take: DEFAULT_COMMENT_TAKE,
    select: {
      id: true,
      content: true,
      createdAt: true,
      User: {
        select: {
          id: true,
          nickname: true,
          image: true,
        },
      },
    },
  },
});
