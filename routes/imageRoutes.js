const express = require("express");
const upload = require("../utils/multer"); // upload는 multer에서 가져와야 함
const { imageUpload } = require("../controllers/imageController");
const router = express.Router();

router.post("/upload", upload.single("image"), imageUpload);

module.exports = router;

