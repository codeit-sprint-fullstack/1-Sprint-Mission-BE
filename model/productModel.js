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
    take: pageSize,
    skip: pageSize * offset,
    orderBy: orderOption,
    where,
    include: {
      user: {
        select: {
          name: true,
          id: true,
        },
      },
      comment: {
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
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
      user: {
        select: {
          name: true,
          id: true,
        },
      },
      comment: {
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
};

const create = async (data) => {
  return await prismaClient.product.create({
    data,
    include: {
      user: {
        select: {
          name: true,
          id: true,
        },
      },
      comment: {
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
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
      user: {
        select: {
          name: true,
          id: true,
        },
      },
      comment: {
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
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
  deleteItem,
  create,
};
