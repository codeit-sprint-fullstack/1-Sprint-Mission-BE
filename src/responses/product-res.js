import { SHOW_DEFAULT_COMMENT_COUNT } from "../constants/comment.js";

export const productSelect = {
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
  user: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
};

export const productFavoriteSelect = (myUserId) => ({
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
  user: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
  FavoriteProduct: {
    where: {
      userId: myUserId,
    },
    select: {
      id: true,
    },
  },
});

export const productDetailSelect = {
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
  user: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
  ProductComment: {
    orderBy: { createdAt: "asc" },
    skip: 0,
    take: SHOW_DEFAULT_COMMENT_COUNT,
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
};
