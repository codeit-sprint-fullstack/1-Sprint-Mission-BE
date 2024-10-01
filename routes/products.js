import express from "express";
import { asyncHandle } from "../utils/errorUtils.js";
import productService from "../service/productService.js";
import { assert } from "superstruct";
import multer from "multer";
import passport from "../config/passportConfig.js";

const router = express.Router();
const upload = multer({ dest: "upload/" });

router.get(
  "/",
  asyncHandle(async (req, res, next) => {
    try {
      const { totalCount, products, hasMore } =
        await productService.getProducts(req.query);
      const responseData = {
        list: products,
        totalCount: totalCount,
        hasMore,
      };
      return res.send(responseData);
    } catch (error) {
      return next(error);
    }
  })
);

router.get(
  "/:id",
  passport.authenticate("access-token", { session: false }), //인가된 사용자만 상세페이지를 볼수 있다.
  asyncHandle(async (req, res, next) => {
    try {
      const { id: productId } = req.params;
      const { id: userId } = req.user;
      //헤당 상품의 좋아요를 확인하기 위해 사용자정보를 함께 보낸다
      const { product, existingLike } = await productService.getProduct({
        productId,
        userId,
      });
      if (existingLike) {
        //현재 사용자의 좋아요의 상태를 확인하고 리스폰스에 반영
        return res.status(200).send({ ...product, isFavorite: true });
      } else {
        return res.status(200).send({ ...product, isFavorite: false });
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
  async (req, res, next) => {
    try {
      const images = req.files.map((file) => file.path);
      const { id: userId } = req.user;
      const data = await productService.createProduct({
        ...req.body,
        images,
        ownerId: userId,
      });
      return res.status(201).send(data);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id",
  asyncHandle(async (req, res, next) => {
    assert(req.body, updateArticle);
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);
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
      const { id: userId } = req.user;
      const product = await productService.likeProduct({ productId, userId });
      return res.status(200).send({ ...product, isFavorite: true });
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
      const { id: userId } = req.user;
      const product = await productService.unlikeProduct({ productId, userId });
      return res.status(200).send({ ...product, isFavorite: false });
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
      await productService.deleteProduct(id, req.body);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
