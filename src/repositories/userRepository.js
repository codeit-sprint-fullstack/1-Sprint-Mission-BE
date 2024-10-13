import prisma from "./prisma.js";
import { userSelect } from "../responses/user-res.js";
import {
  getProductQueryFilter,
  getProductSearchFilter,
} from "../utils/productUtil.js";
import { productSelect } from "../responses/product-res.js";

async function getMyInfoByUserId(userId) {
  return prisma.user.findUnique({ where: { id: userId }, select: userSelect });
}

async function updateMyInfoByUserId({ userId, data }) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: userSelect,
  });
}

async function updateUserPasswordByUserId({ userId, newHashedPassword }) {
  return await prisma.user.update({
    where: { id: userId },
    data: { encryptedPassword: newHashedPassword },
    select: userSelect,
  });
}

async function getMyProductsByQuery({ userId, query }) {
  const filter = getProductQueryFilter(query);

  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      Product: {
        ...filter,
        select: productSelect,
      },
    },
  });
}

async function getMyProductsByKeywordTotalCount({ userId, keyword }) {
  const filter = getProductSearchFilter(keyword);

  return await prisma.product.count({
    where: {
      userId: userId,
      ...filter,
    },
  });
}

async function getMyFavoriteProductsByQuery({ userId, query }) {
  const filter = getProductQueryFilter(query);

  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      FavoriteProduct: {
        include: {
          Product: {
            ...filter,
            select: productSelect,
          },
        },
      },
    },
  });
}

async function getMyfavoriteProductsByKeywordTotalCount({ userId, keyword }) {
  const filter = getProductSearchFilter(keyword);

  return await prisma.favoriteProduct.count({
    where: {
      userId: userId,
      ...filter,
    },
  });
}

export default {
  updateUserPasswordByUserId,
  getMyInfoByUserId,
  updateMyInfoByUserId,
  getMyProductsByQuery,
  getMyFavoriteProductsByQuery,
  getMyProductsByKeywordTotalCount,
  getMyfavoriteProductsByKeywordTotalCount,
};
