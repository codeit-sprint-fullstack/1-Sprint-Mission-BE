const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

router.get("/me", authMiddleware, userController.getMe);
router.patch("/me", authMiddleware, userController.updateMe);
router.patch("/me/password", authMiddleware, userController.updatePassword);
router.get("/me/products", authMiddleware, userController.getMyProducts);

module.exports = router;
