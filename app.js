import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // 추가
import userRoute from './src/routes/users.js';
import freeboardRoute from './src/routes/freeboard.js';
import fleamarketRoute from './src/routes/fleamarket.js';
import articleRoute from './src/routes/articles.js';
import commentRoute from './src/routes/comments.js';
import favoriteRoute from './src/routes/favorite.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('default path');
});

app.use('/articles', articleRoute);
app.use('/freeboard', freeboardRoute);
app.use('/fleamarket', fleamarketRoute);
app.use('/comments', commentRoute);
app.use('/users', userRoute);
app.use('/favorite', favoriteRoute);

app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || '서버 오류',
  });
});

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
