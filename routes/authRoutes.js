const express = require('express');
const { signUp, signIn } = require('../controllers/authController');
const validationMiddleware = require('../middlewares/validationMiddleware');
const router = express.Router();

router.post('/signUp', validationMiddleware, signUp);

router.post('/signIn', validationMiddleware, signIn);

module.exports = router;

