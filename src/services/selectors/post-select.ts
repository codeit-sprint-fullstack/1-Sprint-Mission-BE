import { Prisma } from "@prisma/client";

import { DEFAULT_COMMENT_TAKE } from "../../constants/post";

export const postSelect: Prisma.PostSelect = {
  id: true,
  name: true,
  content: true,
  favoriteCount: true,
  createdAt: true,
  PostImage: {
    select: {
      image: true,
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

export const postFavoriteSelect = (myUserId: string): Prisma.PostSelect => ({
  ...postSelect,
  FavoritePost: {
    where: {
      userId: myUserId,
    },
    select: {
      id: true,
    },
  },
});

export const postDetailSelect = (myUserId: string): Prisma.PostSelect => ({
  ...postFavoriteSelect(myUserId),
  PostComment: {
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
