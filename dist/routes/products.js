"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_js_1 = require("../controller/productController.js");
const router = express_1.default.Router();
router.get("/total", productController_js_1.getProductTotalCountController);
router.get("/:id", productController_js_1.getProductController);
router.get("/", productController_js_1.getProductListController);
router.post("/", productController_js_1.postProductController);
router.patch("/:id", productController_js_1.patchProductController);
router.delete("/:id", productController_js_1.deleteProductController);
exports.default = router;
