import express from 'express';
import {
  loginController,
  signupController,
} from '../controller/authController.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);

export default router;
