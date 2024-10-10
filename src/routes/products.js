import express from "express";
import { PrismaClient } from "@prisma/client";

import { validateAccessToken, includeToken } from "../middlewares/auth.js";
import { productSelect } from "../responses/product-res.js";
import { productForm } from "../mappers/product-mapper.js";

const prisma = new PrismaClient();
const productRouter = express.Router();

/** POST /products */
productRouter.post("/", validateAccessToken, (req, res, next) => {
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
});

/** GET /products */
productRouter.get("/", includeToken, (req, res, next) => {
  const { page, pageSize, order, keyWord = "" } = req.query;

  // includeToken 로 유효한 토큰 정보가 있을 때 user id를 기준으로 favorite 정보까지 추가할 예정

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
    select: productSelect,
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

/** GET /products/:id */
productRouter.get("/:id", validateAccessToken, (req, res, next) => {
  const { id } = req.params;

  prisma.product
    .findUnique({ where: { id } })
    .then((data) => res.status(200).send(productForm(data)))
    .catch((err) => next(err));
});

/** PATCH /products/:id */
productRouter.patch("/:id", validateAccessToken, (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, images, tags } = req.body;
  const updateData = {
    ...(name && { name }),
    ...(description && { description }),
    ...(price && { price }),
    ...(images && { images }),
    ...(tags && { tags }),
  };

  prisma.product
    .update({ where: { id }, data: updateData })
    .then((data) => {
      res.status(200).send(productForm(data));
    })
    .catch((err) => next(err));
});

/** DELETE /products/:id */
productRouter.delete("/:id", validateAccessToken, (req, res, next) => {
  const { id } = req.params;
  prisma.product
    .delete({ where: { id } })
    .then((data) => res.status(204).send());
});

export default productRouter;
