import express from "express";
import { PrismaClient } from "@prisma/client";

import { validateAccessToken, includeToken } from "../middlewares/auth.js";
import { validateProductInput } from "../middlewares/validateInput.js";
import {
  productSelect,
  productFavoriteSelect,
  productDetailSelect,
} from "../responses/product-res.js";
import { productForm, productDetailForm } from "../mappers/product-mapper.js";

const prisma = new PrismaClient();
const productRouter = express.Router();

/** POST /products */
productRouter.post(
  "/",
  validateAccessToken,
  validateProductInput,
  (req, res, next) => {
    const { name, description, price, images, tags } = req.body;
    const newProductData = {
      name,
      description,
      price,
      userId: req.id,
      ProductImage: {
        create: images.map((image) => ({ image })),
      },
      ProductTag: {
        create: tags.map((tag) => ({ tag })),
      },
    };

    prisma.product
      .create({
        data: newProductData,
        select: productSelect,
      })
      .then((data) => res.status(201).send(productForm(data)))
      .catch((err) => next(err));
  }
);

/** GET /products */
productRouter.get("/", includeToken, (req, res, next) => {
  const { page, pageSize, order, keyWord = "" } = req.query;

  let orderBy;
  switch (order) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "recent":
    default:
      orderBy = { createdAt: "desc" };
  }

  const pageNum = Number(page) || 1;
  const pageSizeNum = Number(pageSize) || 10;
  const skipInt = (pageNum - 1) * pageSizeNum;
  const select = req.id ? productFavoriteSelect(req.id) : productSelect;

  const productsPromise = prisma.product.findMany({
    orderBy,
    skip: parseInt(skipInt),
    take: parseInt(pageSizeNum),
    where: {
      OR: [
        { name: { contains: keyWord } },
        { description: { contains: keyWord } },
      ],
    },
    select: select,
  });

  const totalCountPromise = prisma.product.count({
    where: {
      userId: req.id,
      OR: [
        { name: { contains: keyWord } },
        { description: { contains: keyWord } },
      ],
    },
  });

  Promise.all([productsPromise, totalCountPromise]).then(
    ([products, totalCount]) => {
      const transformedProducts = products.map((product) =>
        productForm(product)
      );
      res.status(200).send({ totalCount, products: transformedProducts });
    }
  );
});

/** GET /products/:productId */
productRouter.get("/:id", validateAccessToken, (req, res, next) => {
  const { id } = req.params;

  prisma.product
    .findUnique({ where: { id }, select: productDetailSelect })
    .then((data) => res.status(200).send(productDetailForm(data)))
    .catch((err) => next(err));
});

/** PATCH /products/:productId */
productRouter.patch(
  "/:productId",
  validateAccessToken,
  validateProductInput,
  (req, res, next) => {
    const { productId: id } = req.params;
    const { name, description, price, images, tags } = req.body;
    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price }),
    };

    const deleteImgs = images
      ? prisma.productImage.deleteMany({
          where: { productId: id },
        })
      : null;

    const deleteTags = tags
      ? prisma.productTag.deleteMany({
          where: { productId: id },
        })
      : null;

    const createImgs = images
      ? prisma.productImage.createMany({
          data: images.map((image) => ({ productId: id, image })),
        })
      : null;

    const createTags = tags
      ? prisma.productTag.createMany({
          data: tags.map((tag) => ({ productId: id, tag })),
        })
      : null;

    prisma
      .$transaction(
        [deleteImgs, deleteTags, createImgs, createTags].filter(Boolean)
      )
      .then((data) => {
        prisma.product
          .update({ where: { id }, data: updateData, select: productSelect })
          .then((data) => {
            return res.status(200).send(productForm(data));
          });
      })
      .catch((err) => next(err));
  }
);

/** DELETE /products/:productId */
productRouter.delete("/:id", validateAccessToken, (req, res, next) => {
  const { id } = req.params;
  prisma.product
    .delete({ where: { id } })
    .then((data) => res.status(204).send());
});

export default productRouter;

/** POST /products/:productId/favorite */
productRouter.post(
  "/:productId/favorite",
  validateAccessToken,
  (req, res, next) => {
    const { productId } = req.params;
    const newFavoriteProductData = { userId: req.id, productId: productId };

    prisma
      .$transaction([
        prisma.favoriteProduct.create({ data: newFavoriteProductData }),
        prisma.product.update({
          where: { id: productId },
          data: {
            favoriteCount: {
              increment: 1,
            },
          },
          select: productFavoriteSelect(req.id),
        }),
      ])
      .then(([createFavoriteProduct, productData]) => {
        return res.status(200).send(productForm(productData));
      })
      .catch((err) => next(err));
  }
);

/** DELETE /products/:productId/favorite */
productRouter.delete(
  "/:productId/favorite",
  validateAccessToken,
  (req, res, next) => {
    const { productId } = req.params;
    const condition = { AND: [{ userId: req.id }, { productId: productId }] };

    prisma
      .$transaction([
        prisma.favoriteProduct.deleteMany({
          where: condition,
        }),
        prisma.product.update({
          where: { id: productId },
          data: {
            favoriteCount: {
              decrement: 1,
            },
          },
          select: productFavoriteSelect(req.id),
        }),
      ])
      .then(([deleteFavoriteProduct, productData]) => {
        return res.status(200).send(productForm(productData));
      })
      .catch((err) => next(err));
  }
);
