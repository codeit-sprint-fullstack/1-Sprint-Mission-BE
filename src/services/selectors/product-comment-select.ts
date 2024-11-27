import { Prisma } from "@prisma/client";

export const productCommentSelect: Prisma.ProductCommentSelect = {
  id: true,
  productId: true,
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
