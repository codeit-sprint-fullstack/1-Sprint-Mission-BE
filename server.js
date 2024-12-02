'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const dotenv_1 = __importDefault(require('dotenv'));
const cors_1 = __importDefault(require('cors'));
const userRoutes_1 = __importDefault(require('./routes/userRoutes'));
const errorHandler_1 = __importDefault(require('./middleware/errorHandler'));
const productsRoutes_1 = __importDefault(require('./routes/productsRoutes'));
const commentsRoutes_1 = __importDefault(require('./routes/commentsRoutes'));
const articleRoutes_1 = __importDefault(require('./routes/articleRoutes'));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', userRoutes_1.default); // 유저 회원가입, 로그인
app.use('/products', productsRoutes_1.default);
app.use('/products', commentsRoutes_1.default);
app.use('/articles', articleRoutes_1.default);
app.use('/articles', commentsRoutes_1.default);
// 404 Not Found 처리 미들웨어
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});
// 에러 핸들러 등록
app.use(errorHandler_1.default);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
