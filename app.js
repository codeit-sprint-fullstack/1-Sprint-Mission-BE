import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import articleRoute from './route/articles.js';
import boardRoute from './route/board.js';
import commentRoute from './route/comments.js';
import userRoute from './route/users.js';
import multer from 'multer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('default path');
});

app.use('/articles', articleRoute);
// app.use('/freeboard', freeboardRoute);
app.use('/comments', commentRoute);
app.use('/users', userRoute);
app.use('/', boardRoute);

const upload = multer({ dest: 'uploads/' });

app.post('/files', upload.single('attachment'), (req, res) => {
  console.log(req.file);
  res.json({ message: '파일 업로드 완료!' });
});

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));

console.log('Using port:', process.env.PORT || 3000);
