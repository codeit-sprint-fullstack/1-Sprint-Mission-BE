import { Product } from "@prisma/client";

import prisma from "../repositories/prisma";
import productRepository from "../repositories/product-repository";
import productTagRepository from "../repositories/product-tag-repository";
import productImageRepository from "../repositories/product-image-repository";
import favoriteproductRepository from "../repositories/favorite-product-repository";
import {
  CreateProductParam,
  GetProductListParam,
  ModifyProductParam,
  ProductFavoriteParam,
  ProductBaseInfo,
  ProductDetailInfo,
  ProductListInfo,
  ProductDetailData,
} from "../types/product-types";
import {
  productSelect,
  productFavoriteSelect,
  productDetailSelect,
} from "./selectors/product-select";
import {
  productMapper,
  productDetailMapper,
  productListMapper,
} from "./mappers/product-mapper";

import { ORDER_BY, DEFAULT_ORDER_BY } from "../constants/sort";
import { DEFAULT_PRODUCT_TAKE } from "../constants/product";

async function createProduct({
  userId,
  name,
  description,
  price,
  images,
  tags,
}: CreateProductParam): Promise<ProductBaseInfo> {
  const result = await prisma.$transaction(async () => {
    const data = {
      User: {
        connect: { id: userId },
      },
      name,
      description,
      price,
    };
    const newProduct = await productRepository.createData({
      data,
      select: productSelect,
    });

    if (images && images.length > 0) {
      const imageListData = images?.map((image) => {
        return { productId: newProduct.id, image } as {
          productId: string;
          image: string;
        };
      });

      await productImageRepository.createManyData(imageListData);
    }

    if (tags && tags.length > 0) {
      const tagListData = tags?.map((tag) => {
        return { productId: newProduct.id, tag } as {
          productId: string;
          tag: string;
        };
      });

      await productTagRepository.createManyData(tagListData);
    }

    const where = { id: newProduct.id };

    return await productRepository.findUniqueOrThrowData({
      where,
      select: productFavoriteSelect(userId),
    });
  });

  return productMapper(result);
}

async function getProductList({
  userId,
  orderBy,
  page,
  pageSize,
  keyword,
}: GetProductListParam): Promise<ProductListInfo> {
  const productOrderBy = ORDER_BY[orderBy] || DEFAULT_ORDER_BY;
  const where = {
    ...(keyword && {
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ],
    }),
  };
  const iPage: number = parseInt(page as unknown as string) || 1;
  const iPageSize: number =
    parseInt(pageSize as unknown as string) || DEFAULT_PRODUCT_TAKE;
  const skip: number = (iPage - 1) * iPageSize;
  const take: number = iPageSize;
  const count: number = await productRepository.countData(where);
  const productList: Partial<Product>[] =
    await productRepository.findManyByPaginationData({
      orderBy: productOrderBy,
      skip,
      take,
      where,
      select: productFavoriteSelect(userId),
    });

  return productListMapper({ count, productList });
}

async function getProduct({
  userId,
  productId,
}: ProductFavoriteParam): Promise<ProductDetailInfo> {
  const where = {
    id: productId,
  };

  const result: Partial<Product> =
    await productRepository.findUniqueOrThrowData({
      where,
      select: productDetailSelect(userId),
    });

  return productDetailMapper(result as ProductDetailData);
}

async function modifyProduct({
  userId,
  productId,
  name,
  description,
  price,
  images,
  tags,
}: ModifyProductParam): Promise<ProductBaseInfo> {
  const result = await prisma.$transaction(async () => {
    if (images) {
      const imageListData = images?.map((image) => {
        return { productId, image };
      });

      await productImageRepository.deleteManyData({ productId });
      await productImageRepository.createManyData(imageListData);
    }

    if (tags) {
      const tagListData = tags?.map((tag) => {
        return { productId, tag };
      });

      await productTagRepository.deleteManyData({ productId });
      await productTagRepository.createManyData(tagListData);
    }

    const where = { id: productId };
    const data = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price }),
    };

    return await productRepository.updateData({
      where,
      data,
      select: productFavoriteSelect(userId),
    });
  });

  return productMapper(result);
}

async function deleteProduct(productId: string): Promise<void> {
  const where = { id: productId };

  return await productRepository.deleteData(where);
}

async function increaseProductFavorite({
  userId,
  productId,
}: ProductFavoriteParam) {
  const productWhere = { id: productId };
  const productData = { favoriteCount: { increment: 1 } };
  const favoriteProductData = {
    User: {
      connect: { id: userId },
    },
    Product: {
      connect: { id: productId },
    },
  };

  const result: Partial<Product> = await prisma.$transaction(async () => {
    await favoriteproductRepository.createData({ data: favoriteProductData });

    return await productRepository.updateData({
      where: productWhere,
      data: productData,
      select: productFavoriteSelect(userId),
    });
  });

  return productMapper(result);
}

async function decreaseProductFavorite({
  userId,
  productId,
}: ProductFavoriteParam) {
  const productWhere = { id: productId };
  const productData = { favoriteCount: { decrement: 1 } };
  const favoriteProductWhere = {
    userId_productId: {
      userId,
      productId,
    },
  };

  const result: Partial<Product> = await prisma.$transaction(async () => {
    await favoriteproductRepository.deleteData(favoriteProductWhere);

    return await productRepository.updateData({
      where: productWhere,
      data: productData,
      select: productFavoriteSelect(userId),
    });
  });

  return productMapper(result);
}

export default {
  createProduct,
  getProductList,
  getProduct,
  modifyProduct,
  deleteProduct,
  increaseProductFavorite,
  decreaseProductFavorite,
};
