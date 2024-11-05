"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const userRoutes_js_1 = __importDefault(require("./routes/userRoutes.js"));
const productRoutes_js_1 = __importDefault(require("./routes/productRoutes.js"));
const articleRoutes_js_1 = __importDefault(require("./routes/articleRoutes.js"));
const commentRoutes_js_1 = __importDefault(require("./routes/commentRoutes.js"));
const errorHandler_js_1 = require("./middlewares/errorHandler.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", authRoutes_js_1.default);
app.use("/users", userRoutes_js_1.default);
app.use("/products", productRoutes_js_1.default);
app.use("/articles", articleRoutes_js_1.default);
app.use("/", commentRoutes_js_1.default);
app.use(errorHandler_js_1.errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});
exports.default = app;
