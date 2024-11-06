import { whereConditions } from "../utils/interfaces/whereConditions";
import prismaClient from "../utils/prismaClient";
import { Product } from "@prisma/client";

// function whereConditions(keyword: string) {
//   return keyword
//     ? (whereConditions.OR = [
//         { name: { contains: keyword, mode: "insensitive" } },
//         { description: { contains: keyword, mode: "insensitive" } },
//       ])
//     : {};
// }

const getTotalCount = async (where: whereConditions) => {
  return await prismaClient.product.count({
    where,
  });
};

const getList = async (
  pageSize: number,
  offset: number,
  orderOption: { [key: string]: string },
  where: whereConditions
) => {
  return await prismaClient.product.findMany({
    take: pageSize,
    skip: pageSize * offset,
    orderBy: orderOption,
    where,
    include: {
      owner: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const getById = async (id: string) => {
  return await prismaClient.product.findUnique({
    where: {
      id,
    },
    include: {
      owner: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const create = async (data: Product) => {
  return await prismaClient.product.create({
    data,
    include: {
      owner: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const update = async (id: string, data: Product) => {
  return await prismaClient.product.update({
    where: {
      id,
    },
    data,
    include: {
      owner: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const existingLike = async (productId: string, userId: string) => {
  return prismaClient.product.findUnique({
    where: {
      id: productId,
      favorited: {
        some: {
          id: userId,
        },
      },
    },
  });
};

const likeProduct = async (productId: string, userId: string) => {
  return prismaClient.product.update({
    where: {
      id: productId,
    },
    data: {
      favorited: {
        connect: { id: userId },
      },
      favoriteCount: { increment: 1 },
    },
    include: {
      owner: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const unlikeProduct = async (productId: string, userId: string) => {
  return prismaClient.product.update({
    where: {
      id: productId,
    },
    data: {
      favorited: {
        disconnect: { id: userId },
      },
      favoriteCount: { decrement: 1 },
    },
    include: {
      owner: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const deleteItem = async (id: string) => {
  return await prismaClient.product.delete({
    where: {
      id,
    },
  });
};

export default {
  getTotalCount,
  getById,
  getList,
  update,
  existingLike,
  likeProduct,
  unlikeProduct,
  deleteItem,
  create,
};
