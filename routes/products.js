import express from 'express';
import {
  deleteProduct,
  getProduct,
  getProductList,
  patchProduct,
  postProduct,
} from '../controller/productController.js';

const router = express.Router();

router.get('/:id', getProduct);
router.get('/', getProductList);
router.post('/', postProduct);
router.patch('/:id', patchProduct);
router.delete('/:id', deleteProduct);

export default router;
