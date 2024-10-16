import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as controller from '../controllers/userController.js';
import { authentication } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me', authentication, asyncHandler(controller.getUserMe));

export default router;
