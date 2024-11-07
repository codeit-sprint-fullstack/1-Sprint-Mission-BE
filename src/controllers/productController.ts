import express, { NextFunction, Request, Response } from "express";
import { asyncHandle } from "../utils/errorUtils";
import productService from "../services/productService";
import { assert } from "superstruct";
import { updateProduct } from "../structs/productStruct";
import multer from "multer";
import passport from "../config/passportConfig";
import { PUBLIC_IMAGES_URL } from "../env";
import { ProductData } from "../utils/interfaces/products/productData";

const router = express.Router();
const upload = multer({ dest: "upload/" });

router.get(
  "/",
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { totalCount, products, hasMore } =
        await productService.getProducts(req);
      const responseData = {
        list: products,
        totalCount: totalCount,
        hasMore,
      };
      res.send(responseData);
    } catch (error) {
      return next(error);
    }
  })
);

router.get(
  "/:id",
  passport.authenticate("access-token", { session: false }), //인가된 사용자만 상세페이지를 볼수 있다.
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: productId } = req.params;
      const { id: userId } = req.user as { id: string };
      //헤당 상품의 좋아요를 확인하기 위해 사용자정보를 함께 보낸다
      const { product, existingLike } = await productService.getProduct(
        productId,
        userId
      );
      if (existingLike) {
        //현재 사용자의 좋아요의 상태를 확인하고 리스폰스에 반영
        res.status(200).send({ ...product, isFavorite: true });
      } else {
        res.status(200).send({ ...product, isFavorite: false });
      }
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/",
  passport.authenticate("access-token", { session: false }), //인가된 사용자만 작성가능
  upload.array("images", 3),
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const images = (req.files as Express.Multer.File[]).map(
        (file) => PUBLIC_IMAGES_URL + file.filename
      );
      const tags = req.body.tags.split(",");
      const { id: userId } = req.user as { id: string };
      const data = await productService.createProduct({
        ...req.body,
        tags,
        price: parseInt(req.body.price),
        images,
        ownerId: userId,
      });
      res.status(201).send(data);
    } catch (error) {
      next(error);
    }
  })
);

router.patch(
  "/:id",
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    assert(req.body, updateProduct);
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(
        id,
        req.body as ProductData
      );
      res.send(product);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/:id/favorite",
  passport.authenticate("access-token", { session: false }), //인가된 사용자만 작성가능
  asyncHandle(async (req, res, next) => {
    try {
      const { id: productId } = req.params;
      const { id: userId } = req.user as { id: string };
      const product = await productService.likeProduct(productId, userId);
      res.status(200).send({ ...product, isFavorite: true });
    } catch (error) {
      next(error);
    }
  })
);

router.delete(
  "/:id/favorite",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    try {
      const { id: productId } = req.params;
      const { id: userId } = req.user as { id: string };
      const product = await productService.unlikeProduct(productId, userId);
      res.status(200).send({ ...product, isFavorite: false });
    } catch (error) {
      next(error);
    }
  })
);

router.delete(
  "/:id",
  asyncHandle(async (req, res, next) => {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
