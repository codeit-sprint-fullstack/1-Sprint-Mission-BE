import express from 'express';
import {
  deleteProductController,
  getProductController,
  getProductListController,
  getProductTotalCountController,
  patchProductController,
  postProductController,
  postProductLikeController,
  deleteProductLikeController,
} from '../controller/productController.js';

const router = express.Router();

router.get('/total', getProductTotalCountController);
router.get('/:id', getProductController);
router.get('/', getProductListController);
router.post('/', postProductController);
router.patch('/:id', patchProductController);
router.delete('/:id', deleteProductController);
router.post('/like', postProductLikeController);
router.delete('/like', deleteProductLikeController);

export default router;
