import express from 'express';
import * as p from '../controllers/productControllers.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { createProductComment } from '../controllers/commentControllers.js';

const router = express.Router();

router.get('/', asyncHandler(p.getProducts));
router.get('/:id', asyncHandler(p.getProductById));
router.post('/', asyncHandler(p.createProduct));
router.patch('/:id', asyncHandler(p.updateProductById));
router.delete('/:id', asyncHandler(p.deleteProductById));

router.post('/:id/comments', asyncHandler(createProductComment));

export default router;
