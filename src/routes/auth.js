const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
