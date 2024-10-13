import express from 'express';
import {
  loginController,
  signupController,
} from '../controller/authController';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/refresh');

export default router;
