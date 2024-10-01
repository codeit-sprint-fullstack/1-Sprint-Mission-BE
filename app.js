import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

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

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('default path');
});

app.use('/articles', articleRoute);
app.use('/freeboard', freeboardRoute);
app.use('/fleamarket', fleamarketRoute);
app.use('/comments', commentRoute);
app.use('/users', userRoute);
app.use('/favorite', favoriteRoute);

app.post('/files', upload.single('attachment'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
  }
  console.log(req.file);
  res.json({ message: '파일 업로드 완료!', filePath: req.file.path });
});

app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
