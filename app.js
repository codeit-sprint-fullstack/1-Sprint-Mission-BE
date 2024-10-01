import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import userRoute from './src/routes/users.js';
import freeboardRoute from './src/routes/freeboard.js';
import fleamarketRoute from './src/routes/fleamarket.js';
import articleRoute from './src/routes/articles.js';
import commentRoute from './src/routes/comments.js';
import favoriteRoute from './src/routes/favorite.js';

import multer from 'multer';

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

const upload = multer({ dest: 'uploads/' });

app.post('/files', upload.single('attachment'), (req, res) => {
  console.log(req.file);
  res.json({ message: '파일 업로드 완료!' });
});

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
