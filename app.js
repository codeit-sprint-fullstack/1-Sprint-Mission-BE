const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const productRoutes = require('./routes/productRoutes');
const articleRoutes = require('./routes/articleRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');

dotenv.config(); // .env 파일 로드
const app = express();

// 서버 시작 시 업로드 디렉토리가 없으면 생성
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // 쿠키와 인증 헤더 허용
  })
);

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Swagger 설정
const swaggerDocument = yaml.load(
  fs.readFileSync('./swagger/swagger.yaml', 'utf8')
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

app.use((req, res, next) => {
  const error = new Error('해당 리소스를 찾을 수 없습니다.');
  error.status = 404;
  next(error); // 에러 전달
});

app.use(errorHandler);

module.exports = app;
