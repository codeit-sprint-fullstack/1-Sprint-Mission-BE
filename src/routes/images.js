const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");

router.post("/upload", imageController.uploadImage);
router.get("/:productId/images", imageController.getImagesByProductId);
router.delete("/:imageId", imageController.deleteImage);

module.exports = router;
