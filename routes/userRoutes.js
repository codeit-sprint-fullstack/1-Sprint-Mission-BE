const express = require("express");
const {
  getCurrentUser,
  updateUser,
  updatePassword,
  getUserProducts,
  getUserFavorites,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, updateUser);
router.patch("/me/password", authMiddleware, updatePassword);
router.get("/me/products", authMiddleware, getUserProducts);
router.get("/me/favorites", authMiddleware, getUserFavorites);

module.exports = router;
