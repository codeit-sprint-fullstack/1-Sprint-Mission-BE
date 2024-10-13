import express from 'express';
import jwtMiddleware from '../middlewares/jwtMiddleware.js';
import * as favoriteController from '../controllers/favoriteController.js';

const router = express.Router();

router.post(
  '/:id',
  jwtMiddleware.verifyAccessToken,
  favoriteController.postFavorite
);

router.delete(
  '/:id',
  jwtMiddleware.verifyAccessToken,
  favoriteController.deleteFavorite
);

export default router;
