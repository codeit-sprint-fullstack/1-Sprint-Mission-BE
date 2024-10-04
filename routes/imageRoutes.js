const express = require("express");
const { upload, imageUpload } = require("../controllers/imageController");
const router = express.Router();

router.post("/upload", upload.single("image"), imageUpload);

module.exports = router;

