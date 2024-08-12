import express from 'express';
import * as p from '../controllers/productControllers.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

router.get('/', asyncHandler(p.getProducts));
router.get('/:id', asyncHandler(p.getProductById));
router.post('/', asyncHandler(p.createProduct));
router.patch('/:id', asyncHandler(p.updateProductById));
router.delete('/:id', asyncHandler(p.deleteProductById));

export default router;
