import express, { Request, Response, NextFunction } from "express";
import * as productController from "../controllers/productController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validateProductFields } from "../middlewares/validateProductFields.js";
import { imageUpload } from "../middlewares/imageUpload.js";

const router = express.Router();

router
  .route("/")
  .post(
    verifyToken,
    imageUpload.array("images", 3),
    validateProductFields,
    (req: Request, res: Response, next: NextFunction) => {
      const extendedReq = req as Request & {
        files?: Express.Multer.File[];
        user?: { id: number; nickname: string };
      };
      productController.createProduct(extendedReq, res, next);
    }
  )
  .get(productController.getProducts);

router
  .route("/:productId")
  .all(verifyToken)
  .get((req: Request, res: Response, next: NextFunction) => {
    const extendedReq = req as Request & {
      user?: { id: number };
    };
    productController.getProductsById(extendedReq, res, next);
  })

  .patch(
    imageUpload.array("images", 3),
    validateProductFields,
    (req: Request, res: Response, next: NextFunction) => {
      const extendedReq = req as Request & {
        files?: Express.Multer.File[];
      };
      productController.updateProduct(extendedReq, res, next);
    }
  )
  .delete(productController.deleteProduct);

router
  .route("/:productId/favorite")
  .all(verifyToken)
  .post((req: Request, res: Response, next: NextFunction) => {
    const extendedReq = req as Request & {
      user?: { id: number };
    };
    productController.addFavorite(extendedReq, res, next);
  })
  .delete((req: Request, res: Response, next: NextFunction) => {
    const extendedReq = req as Request & {
      user?: { id: number };
    };
    productController.deleteFavorite(extendedReq, res, next);
  });

export default router;
