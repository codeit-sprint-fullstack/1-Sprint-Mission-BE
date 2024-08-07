import express from 'express';
import * as product from '../controllers/productControllers.mjs';
const router = express.Router();

// try-catch asyncHandler
function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (err) {
      if (err.name === 'ValidateError') {
        return res.status(400).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    }
  };
}

router.get('/', asyncHandler(product.getAllProduct));
router.get('/:id', asyncHandler(product.getProductById));
router.post('/', asyncHandler(product.createProduct));
router.patch('/:id', asyncHandler(product.updateProductById));
router.delete('/:id', asyncHandler(product.deleteProductById));

export default router;
