import { validateArticle } from "../middlewares/validateArticle.js";
import express, { Request, Response, NextFunction } from "express";
import * as articleController from "../controllers/articleController";
import { verifyToken } from "../middlewares/verifyToken";
import { imageUpload } from "../middlewares/imageUpload";

const router = express.Router();

router
  .route("/")
  .post(
    verifyToken,
    imageUpload.array("images", 3),
    validateArticle,
    (req: Request, res: Response, next: NextFunction) => {
      // 타입을 확장하여 사용합니다.
      const extendedReq = req as Request & {
        files?: Express.Multer.File[];
        user?: { id: number };
      };
      articleController.createArticle(extendedReq, res, next);
    }
  )
  .get(articleController.getArticles);

router
  .route("/:articleId")
  .all(verifyToken)
  .get((req: Request, res: Response, next: NextFunction) => {
    // 타입을 확장하여 사용합니다.
    const extendedReq = req as Request & {
      user?: { id: number };
    };
    articleController.getArticleById(extendedReq, res, next);
  })
  .patch(
    imageUpload.array("images", 3),
    (req: Request, res: Response, next: NextFunction) => {
      // 타입을 확장하여 사용합니다.
      const extendedReq = req as Request & {
        files?: Express.Multer.File[];
        user?: { id: number };
      };
      articleController.updateArticle(extendedReq, res, next);
    }
  )
  .delete(articleController.deleteArticle);

router
  .route("/:articleId/like")
  .all(verifyToken)
  .post((req: Request, res: Response, next: NextFunction) => {
    // 타입을 확장하여 사용합니다.
    const extendedReq = req as Request & {
      user?: { id: number };
    };
    articleController.addLike(extendedReq, res, next);
  })
  .delete((req: Request, res: Response, next: NextFunction) => {
    // 타입을 확장하여 사용합니다.
    const extendedReq = req as Request & {
      user?: { id: number };
    };
    articleController.deleteLike(extendedReq, res, next);
  });

export default router;
