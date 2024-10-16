import express from 'express';
import * as freeBoardController from '../controllers/freeBoardController.js';
import validateFreeBoardMiddleware from '../middlewares/validate/validateFreeBoardMiddleware.js';
import jwtMiddleware from '../middlewares/jwtMiddleware.js';

const router = express.Router();

router.get('/', freeBoardController.getFreeBoard);

router.get(
  '/:id',
  jwtMiddleware.verifyAccessToken,
  freeBoardController.getFreeBoardDetail
);

router.post(
  '/post',
  jwtMiddleware.verifyAccessToken,
  validateFreeBoardMiddleware,
  freeBoardController.postFreeBoard
);

router.patch(
  '/:id',
  jwtMiddleware.verifyAccessToken,
  jwtMiddleware.verifyFreeBoardAuth,
  validateFreeBoardMiddleware,
  freeBoardController.editFreeBoard
);

router.delete(
  '/:id',
  jwtMiddleware.verifyAccessToken,
  jwtMiddleware.verifyFreeBoardAuth,
  freeBoardController.deleteFreeBoard
);

export default router;
