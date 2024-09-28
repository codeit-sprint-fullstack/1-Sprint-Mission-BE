import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import userRoute from './route/users.js';
import freeboardRoute from './route/freeboard.js';
import fleamarketRoute from './route/fleamarket.js';
import articleRoute from './route/articles.js';
import commentRoute from './route/comments.js';
import favoriteRoute from './route/favorite.js'

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

console.log('Using port:', process.env.PORT || 3000);
