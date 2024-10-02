import prismaClient from "../utils/prismaClient.js";

function whereConditions(keyword) {
  return keyword
    ? (whereConditions.OR = [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ])
    : {};
}

const getTotalCount = async (keyword) => {
  const where = whereConditions(keyword);
  return await prismaClient.product.count({
    where,
  });
};

const getList = async (pageSize, offset, orderOption, keyword) => {
  const where = whereConditions(keyword);
  return await prismaClient.product.findMany({
    take: parseInt(pageSize),
    skip: parseInt(pageSize) * offset,
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

const getById = async (id) => {
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

const create = async (data) => {
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

const update = async (id, data) => {
  return await prismaClient.product.update({
    where: {
      id,
    },
    data,
    include: {
      owner: {
        select: {
          nicknamename: true,
        },
      },
    },
  });
};

const existingLike = async (productId, userId) => {
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

const likeProduct = async ({ productId, userId }) => {
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

const unlikeProduct = async ({ productId, userId }) => {
  return prismaClient.product.update({
    where: {
      id: productId,
    },
    data: {
      favorited: {
        connect: { id: userId },
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

const deleteItem = async (id) => {
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
