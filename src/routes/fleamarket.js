import express from 'express';
import * as fleaMarketController from '../controllers/fleaMarketController.js';
import validateFleaMarketMiddleware from '../middlewares/validateFleaMarketMiddleware.js';
import jwtMiddleware from '../middlewares/jwtMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';

const router = express.Router();

router.get('/', fleaMarketController.getFleaMarket);

router.get(
  '/:id',
  jwtMiddleware.verifyAccessToken,
  fleaMarketController.getFleaMarketDetail
);

router.delete(
  '/:id',
  jwtMiddleware.verifyAccessToken,
  jwtMiddleware.verifyProductAuth,
  fleaMarketController.deleteFleaMarket
);

router.post(
  '/post',
  upload.array('images', 3),
  validateFleaMarketMiddleware,
  jwtMiddleware.verifyAccessToken,
  fleaMarketController.postFleaMarket
);

router.patch(
  '/:id',
  upload.array('images', 3),
  validateFleaMarketMiddleware,
  jwtMiddleware.verifyAccessToken,
  jwtMiddleware.verifyProductAuth,
  fleaMarketController.editFleaMarket
);

export default router;
