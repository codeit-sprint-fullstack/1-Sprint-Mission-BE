import express from 'express';
import {
  deleteProductController,
  getProductController,
  getProductListController,
  patchProductController,
  postProductController,
} from '../controller/productController.js';

const router = express.Router();

router.get('/:id', getProductController);
router.get('/', getProductListController);
router.post('/', postProductController);
router.patch('/:id', patchProductController);
router.delete('/:id', deleteProductController);

export default router;
