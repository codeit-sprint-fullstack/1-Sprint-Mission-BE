// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const articleRoutes = require('./routes/articleRoutes');
const commentRoutes = require('./routes/commentRoutes');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://ibaomarket.netlify.app',
}));
app.use(express.json());

app.use('/api/products', productRoutes);  // /api/products 경로
app.use('/api/articles', articleRoutes);  // /api/articles 경로
app.use('/api/comments', commentRoutes);  // /api/comments 경로

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

