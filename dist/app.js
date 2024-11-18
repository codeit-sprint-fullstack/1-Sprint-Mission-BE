"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const likeRoutes_1 = __importDefault(require("./routes/likeRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const uploadPath = path_1.default.join(__dirname, "../uploads");
if (!fs_1.default.existsSync(uploadPath)) {
    fs_1.default.mkdirSync(uploadPath, { recursive: true });
}
app.use((0, cors_1.default)({
    origin: [process.env.CORS_ORIGIN || "", "http://localhost:3000"],
    credentials: true, // 쿠키와 인증 헤더 허용
}));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static("uploads"));
app.use("/api/products", productRoutes_1.default);
app.use("/api/articles", articleRoutes_1.default);
app.use("/api/comments", commentRoutes_1.default);
app.use("/api/likes", likeRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/images", imageRoutes_1.default);
app.use((req, res, next) => {
    const error = new Error("해당 리소스를 찾을 수 없습니다.");
    error.status = 404;
    next(error);
});
app.use(errorHandler_1.default);
exports.default = app;
