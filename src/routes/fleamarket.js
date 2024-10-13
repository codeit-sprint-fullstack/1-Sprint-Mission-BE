import express from 'express';
import * as fleaMarketController from '../controllers/fleaMarketController.js';
import validateFleaMarketMiddleware from '../middlewares/validate/validateFleaMarketMiddleware.js';
import jwtMiddleware from '../middlewares/jwtMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';

const router = express.Router();

router.get('/', fleaMarketController.getFleaMarket);

router.get(
  '/:id',
  jwtMiddleware.verifyAccessToken,
  fleaMarketController.getFleaMarketDetail
);

router.post(
  '/post',
  upload.array('images', 3),
  jwtMiddleware.verifyAccessToken,
  validateFleaMarketMiddleware,
  fleaMarketController.postFleaMarket
);

router.patch(
  '/:id',
  upload.array('images', 3),
  jwtMiddleware.verifyAccessToken,
  jwtMiddleware.verifyFleaMarketAuth,
  validateFleaMarketMiddleware,
  fleaMarketController.editFleaMarket
);

router.delete(
  '/:id',
  jwtMiddleware.verifyAccessToken,
  jwtMiddleware.verifyFleaMarketAuth,
  fleaMarketController.deleteFleaMarket
);

export default router;
