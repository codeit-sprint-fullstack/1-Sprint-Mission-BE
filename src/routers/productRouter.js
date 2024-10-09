import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as controller from '../controllers/productController.js';
import validateUuid from '../middlewares/validateUuid.js';
import { authentication, productAuthorization } from '../middlewares/auth.js';

const router = express.Router();

router.use('/', authentication);
router.use('/:productId', validateUuid);

router.get('/', asyncHandler(controller.getProductList));
router.get('/:productId', asyncHandler(controller.getProductById));
router.post('/', asyncHandler(controller.createProduct));
router.patch(
  '/:productId',
  productAuthorization,
  asyncHandler(controller.updateProductById)
);
router.delete(
  '/:productId',
  productAuthorization,
  asyncHandler(controller.deleteProductById)
);

router.post(
  '/:productId/favorite',
  asyncHandler(controller.createFavoriteOnProduct)
);
router.delete(
  '/:productId/favorite',
  asyncHandler(controller.deleteFavoriteOnProduct)
);

export default router;
