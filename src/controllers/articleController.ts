import { asyncHandle } from "../utils/errorUtils";
import { assert } from "superstruct";
import { createArticle, updateArticle } from "../structs/articleStruct";
import articleService from "../services/articleService";
import passport from "../config/passportConfig";
import authUser from "../middlewares/authUser";
import express, { Request, Response, NextFunction } from "express";
import { Article } from "@prisma/client";
import { ArticleData } from "../utils/interfaces/articles/articleData";

const router = express.Router();

router.get(
  "/",
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await articleService.getArticles(req);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/:id",
  passport.authenticate("access-token", { session: false }), //인가된 사용자만 상세페이지를 볼수 있다.
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: articleId } = req.params;
      const { id: userId } = req.user as { id: string };
      //헤당 게시글의 좋아요를 확인하기 위해 사용자정보를 함께 보낸다
      const { article, existingLike } = await articleService.getArticle(
        userId,
        articleId
      );
      if (existingLike) {
        //현재 사용자의 좋아요의 상태를 확인하고 리스폰스에 반영
        res.status(200).send({ ...article, isFavorite: true });
      } else {
        res.status(200).send({ ...article, isFavorite: false });
      }
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    assert(req.body, createArticle);
    try {
      const { id: userId } = req.user as { id: string };
      const data = await articleService.createArticle({
        ...(req.body as Article),
        ownerId: userId,
      });
      res.status(201).send(data);
    } catch (error) {
      next();
    }
  })
);

router.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  authUser.verifyArticleAuth,
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    assert(req.body, updateArticle);
    try {
      const { id: articleId } = req.params;
      const data = await articleService.updateArticle(
        articleId,
        req.body as ArticleData
      );
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/:id/favorite",
  passport.authenticate("access-token", { session: false }), //인가된 사용자만 작성가능
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: articleId } = req.params;
      const { id: userId } = req.user as { id: string };
      const article = await articleService.likeArticle(articleId, userId);
      res.status(200).send({ ...article, isFavorite: true });
    } catch (error) {
      next(error);
    }
  })
);

router.delete(
  "/:id/favorite",
  passport.authenticate("access-token", { session: false }),
  authUser.verifyArticleAuth,
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: articleId } = req.params;
      const { id: userId } = req.user as { id: string };
      const article = await articleService.unlikeArticle(articleId, userId);
      res.status(200).send({ ...article, isFavorite: false });
    } catch (error) {
      next(error);
    }
  })
);

router.delete(
  "/:id",
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await articleService.deleteArticle(id);
      res.status(204).send(data);
    } catch (error) {
      next();
    }
  })
);

export default router;
