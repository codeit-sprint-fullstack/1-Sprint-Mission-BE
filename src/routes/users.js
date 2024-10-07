import express from "express";
import { PrismaClient } from "@prisma/client";

import {
  validateAccessToken,
  validateIdPassword,
} from "../middlewares/auth.js";
import { createHashedPassword } from "../lib/password.js";
import { userSelect, productSelect } from "../structs/res-template.js";

const prisma = new PrismaClient();
const userRouter = express.Router();

/** GET /users/me 
 * res : {
  "updatedAt": "2024-10-04T05:04:31.666Z",
  "createdAt": "2024-10-04T05:04:31.666Z",
  "image": "https://example.com/...",
  "nickname": "닉네임",
  "id": 1
}
*/
userRouter.get("/me", validateAccessToken, (req, res, next) => {
  prisma.user
    .findUnique({ where: { id: req.id }, select: userSelect })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
});

/** PATCH /user/me 
 * res : {
  "updatedAt": "2024-10-04T05:11:10.643Z",
  "createdAt": "2024-10-04T05:11:10.643Z",
  "image": "https://example.com/...",
  "nickname": "닉네임",
  "id": 1
}
*/
userRouter.patch("/me", validateAccessToken, (req, res, next) => {
  // const { data } = req.body;
  const { nickname, image } = req.body;
  const newDate = {
    ...(nickname && { nickname }),
    ...(image && { image }),
  };

  prisma.user
    .update({ where: { id: req.id }, data: newDate, select: userSelect })
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
});

/** PATCH /user/password 
 * res : {
  "updatedAt": "2024-10-04T05:11:35.267Z",
  "createdAt": "2024-10-04T05:11:35.267Z",
  "image": "https://example.com/...",
  "nickname": "닉네임",
  "id": 1
}
*/
userRouter.patch(
  "/password",
  validateAccessToken,
  validateIdPassword,
  (req, res, next) => {
    const { password } = req.body;

    createHashedPassword(password)
      .then((encryptedPassword) => {
        prisma.user
          .update({
            where: { id: req.id },
            data: { encryptedPassword },
            select: userSelect,
          })
          .then((user) => {
            return res.status(200).send(user);
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  }
);

// 임시로 코드 작성 : 테스트 필요
/** GET /users/me/products 
 * res : {
  "totalCount": 0,
  "list": [
    {
      "createdAt": "2024-10-04T05:11:50.027Z",
      "favoriteCount": 0,
      "ownerNickname": "string",
      "ownerId": 1,
      "images": [
        "https://example.com/..."
      ],
      "tags": [
        "전자제품"
      ],
      "price": 0,
      "description": "string",
      "name": "상품 이름",
      "id": 1
    }
  ]
}
*/
userRouter.get("/me/products", validateAccessToken, (req, res, next) => {
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

  const userProductsPromise = prisma.user.findUnique({
    where: { id: req.id },
    include: {
      Product: {
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
      },
    },
  });

  const totalCountPromise = prisma.product.findMany.count({
    where: {
      userId: req.id,
      OR: [
        { studyName: { contains: keyWord } },
        { description: { contains: keyWord } },
      ],
    },
  });

  Promise.all([userProductsPromise, totalCountPromise]).then(
    ([userProducts, totalCount]) => {
      const transformedUserProducts = userProducts.Product.map((product) =>
        productForm(product)
      );
      res.status(200).send({ totalCount, products: transformedUserProducts });
    }
  );
});

// 임시로 코드 작성 : 테스트 필요
/** GET /users/me/favorite-products 
 * {
  "totalCount": 0,
  "list": [
    {
      "createdAt": "2024-10-04T05:12:02.898Z",
      "favoriteCount": 0,
      "ownerNickname": "string",
      "ownerId": 1,
      "images": [
        "https://example.com/..."
      ],
      "tags": [
        "전자제품"
      ],
      "price": 0,
      "description": "string",
      "name": "상품 이름",
      "id": 1
    }
  ]
}
*/
userRouter.get(
  "/me/favorite-products",
  validateAccessToken,
  (req, res, next) => {
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

    const favoriteProductsPromise = prisma.user.findUnique({
      where: { id: req.id },
      include: {
        FavoriteProduct: {
          include: {
            Product: {
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
            },
          },
        },
      },
    });

    const totalCountPromise = prisma.product.findMany.count({
      where: {
        userId: req.id,
        OR: [
          { studyName: { contains: keyWord } },
          { description: { contains: keyWord } },
        ],
      },
    });

    Promise.all([favoriteProductsPromise, totalCountPromise]).then(
      ([favoriteProducts, totalCount]) => {
        const transformedFavoriteProducts =
          favoriteProducts.FavoriteProduct.Product.map((product) =>
            productForm(product)
          );
        res
          .status(200)
          .send({ totalCount, products: transformedFavoriteProducts });
      }
    );
  }
);

/** GET /users/me/favorite-posts */

export default userRouter;
