"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../utils/multer"));
const imageController_1 = __importDefault(require("../controllers/imageController"));
const router = express_1.default.Router();
// 이미지 업로드
router.post("/upload", multer_1.default.single("image"), (req, res) => {
    (0, imageController_1.default)(req, res);
});
exports.default = router;
