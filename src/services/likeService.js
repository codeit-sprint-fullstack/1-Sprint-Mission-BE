// 좋아요 기능 구현
// src/services/likeService.js
import prisma from "../utils/prisma.js";

export const toggleLike = async (userId, itemId, itemType) => {
  return prisma.$transaction(async (prisma) => {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_itemId_itemType: {
          userId,
          itemId,
          itemType,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      if (itemType === "product") {
        await prisma.product.update({
          where: { id: itemId },
          data: { likeCount: { decrement: 1 } },
        });
      } else if (itemType === "article") {
        await prisma.article.update({
          where: { id: itemId },
          data: { likeCount: { decrement: 1 } },
        });
      }

      return { isLiked: false };
    } else {
      await prisma.like.create({
        data: {
          userId,
          itemId,
          itemType,
        },
      });

      if (itemType === "product") {
        await prisma.product.update({
          where: { id: itemId },
          data: { likeCount: { increment: 1 } },
        });
      } else if (itemType === "article") {
        await prisma.article.update({
          where: { id: itemId },
          data: { likeCount: { increment: 1 } },
        });
      }

      return { isLiked: true };
    }
  });
};

export const checkIsLiked = async (userId, itemId, itemType) => {
  const like = await prisma.like.findUnique({
    where: {
      userId_itemId_itemType: {
        userId,
        itemId,
        itemType,
      },
    },
  });
  return !!like;
};

export const getLikeCount = async (itemId, itemType) => {
  const count = await prisma.like.count({
    where: {
      itemId,
      itemType,
    },
  });
  return count;
};
