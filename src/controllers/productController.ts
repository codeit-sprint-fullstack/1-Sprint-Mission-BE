import express, { NextFunction, Request, Response } from "express";
import { asyncHandle } from "../utils/errorUtils";
import productService from "../services/productService";
import { assert } from "superstruct";
import { updateProduct } from "../structs/productStruct";
import multer from "multer";
import passport from "../config/passportConfig";
import { PUBLIC_IMAGES_URL } from "../env";
import { ProductData } from "../utils/interfaces/products/productData";
import { imageUpload, uploadToS3 } from "../middlewares/multer/imageUpload";
import { AWS_BUCKET_NAME, AWS_REGION } from "../env";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const router = express.Router();
const upload = multer({ dest: "upload/" });

const s3 = new S3Client({
  region: AWS_REGION!, // S3 버킷이 위치한 리전
});

router.get(
  "/",
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { totalCount, products, hasMore } =
        await productService.getProducts(req);
      const productsWithSignedUrls = await Promise.all(
        products.map(async (product) => {
          // product의 images 배열에서 서명된 URL 생성
          const signedUrls = await Promise.all(
            product.images.map(async (imageUrl) => {
              // DB에서 URL이 https://로 시작하면, 경로만 추출하여 S3 객체 키를 사용
              const imageKey = imageUrl.replace(
                "https://panda-market-0001.s3.ap-northeast-2.amazonaws.com/",
                ""
              );

              const command = new GetObjectCommand({
                Bucket: "panda-market-0001", // 버킷 이름
                Key: imageKey, // S3 객체 키 (경로만)
              });

              // 서명된 URL 생성
              const url = await getSignedUrl(s3, command, {
                expiresIn: 1000 * 60 * 5, // URL의 유효 기간 5분
              });

              return url;
            })
          );

          // 각 product 객체에 서명된 URLs 추가
          return { ...product, images: signedUrls };
        })
      );
      const responseData = {
        list: productsWithSignedUrls,
        totalCount,
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
        userId,
        productId
      );
      const signedUrls = await Promise.all(
        product.images.map(async (imageUrl) => {
          const imageKey = imageUrl.replace(
            "https://panda-market-0001.s3.ap-northeast-2.amazonaws.com/",
            ""
          );
          const command = new GetObjectCommand({
            Bucket: AWS_BUCKET_NAME, // 버킷 이름
            Key: imageKey, // S3 객체 키
          });
          // 서명된 URL 생성
          const url = await getSignedUrl(s3, command, {
            expiresIn: 3600, // URL의 유효 기간 (초 단위, 예: 1시간 = 3600초)
          });

          return url;
        })
      );

      if (existingLike) {
        //현재 사용자의 좋아요의 상태를 확인하고 리스폰스에 반영
        res
          .status(200)
          .send({ ...product, images: signedUrls, isFavorite: true });
      } else {
        res
          .status(200)
          .send({ ...product, images: signedUrls, isFavorite: false });
      }
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/",
  passport.authenticate("access-token", { session: false }), //인가된 사용자만 작성가능
  imageUpload.array("images", 3),
  uploadToS3, // 압축 후 S3 업로드
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const images = (req.files as Express.Multer.File[])?.map(
        (file) => file.filename
      );
      const tags = req.body.tags;
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
      const { id: userId } = req.user as { id: string };
      const { id: productId } = req.params;
      const product = await productService.likeProduct(userId, productId);
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
      const { id: userId } = req.user as { id: string };
      const { id: productId } = req.params;
      const product = await productService.unlikeProduct(userId, productId);
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
      const { id: ProductId } = req.params;
      await productService.deleteProduct(ProductId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
