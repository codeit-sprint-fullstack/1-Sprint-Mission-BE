import express from 'express';
import jwtMiddleware from '../middlewares/jwtMiddleware';
import * as favoriteController from '../controllers/favoriteController';

const router = express.Router();

router.post(
  '/:articleCategory/:articleId',
  jwtMiddleware.verifyAccessToken,
  favoriteController.postFavorite
);

router.delete(
  '/:articleCategory/:articleId',
  jwtMiddleware.verifyAccessToken,
  favoriteController.deleteFavorite
);

export default router;
