import { Prisma } from "@prisma/client";

export const postCommentSelect: Prisma.PostCommentSelect = {
  id: true,
  postId: true,
  content: true,
  createdAt: true,
  User: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
};
