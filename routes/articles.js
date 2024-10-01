import express from "express";
import { asyncHandle } from "../utils/errorUtils.js";
import { assert } from "superstruct";
import { createArticle, updateArticle } from "../structs/articleStruct.js";
import articleService from "../service/articleService.js";
import passport from "../config/passportConfig.js";
import authUser from "../middlewares/authUser.js";

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: 게시글
 */

const router = express.Router();

router.get(
  "/",
  asyncHandle(async (req, res, next) => {
    try {
      const data = await articleService.getArticles(req.query);
      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/:id",
  passport.authenticate("access-token", { session: false }), //인가된 사용자만 상세페이지를 볼수 있다.
  asyncHandle(async (req, res, next) => {
    try {
      const { id: articleId } = req.params;
      const { id: userId } = req.user;
      //헤당 게시글의 좋아요를 확인하기 위해 사용자정보를 함께 보낸다
      const { article, existingLike } = await articleService.getArticle({
        userId,
        articleId,
      });
      if (existingLike) {
        //현재 사용자의 좋아요의 상태를 확인하고 리스폰스에 반영
        return res.status(200).send({ ...article, isFavorite: true });
      } else {
        return res.status(200).send({ ...article, isFavorite: false });
      }
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req, res, next) => {
    assert(req.body, createArticle);
    //서버에서 로그인된 사용자의 정보를 반영한다
    const { id: userId } = req.user;
    try {
      const data = await articleService.createArticle({
        ...req.body,
        ownerId: userId,
      });
      return res.status(201).send(data);
    } catch (error) {
      next();
    }
  })
);

router.patch(
  "/:id",
  passport.authenticate("access-token", { session: false }),
  authUser.verifyArticleAuth,
  asyncHandle(async (req, res, next) => {
    assert(req.body, updateArticle);
    try {
      const { id } = req.body;
      const data = await articleService.updateArticle(id);
      return res.status(200).send(data);
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
      const { id: articleId } = req.params;
      const { id: userId } = req.user;
      const article = await articleService.likeArticle({ articleId, userId });
      return res.status(200).send({ ...article, isFavorite: true });
    } catch (error) {
      next(error);
    }
  })
);

router.delete(
  "/:id/favorite",
  passport.authenticate("access-token", { session: false }),
  authUser.verifyArticleAuth,
  asyncHandle(async (req, res, next) => {
    try {
      const { id: articleId } = req.params;
      const { id: userId } = req.user;
      const article = await articleService.unlikeArticle({ articleId, userId });
      return res.status(200).send({ ...article, isFavorite: false });
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
      const data = await articleService.deleteArticle(id);
      return res.status(204).send(data);
    } catch (error) {
      next();
    }
  })
);

export default router;
