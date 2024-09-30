import express from "express";
import { asyncHandle } from "../utils/errorUtils.js";
import prismaClient from "../utils/prismaClient.js";
import productService from "../service/productService.js";
import { assert } from "superstruct";
import multer from "multer";

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
  asyncHandle(async (req, res, next) => {
    try {
      const id = req.params.id;
      const product = await productService.getById(id);
      res.send(product);
    } catch (error) {
      next(error);
    }
  })
);

router.post("/", upload.array("images", 3), async (req, res, next) => {
  const images = req.files.map((file) => file.path);
  try {
    const data = await productService.createProduct({
      ...req.body,
      images,
    });
    return res.status(201).send(data);
  } catch (error) {
    next(error);
  }
});

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
