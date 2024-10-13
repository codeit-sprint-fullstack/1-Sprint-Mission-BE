import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import userRoute from './src/routes/user.js';
import authRoute from './src/routes/auth.js';
import freeboardRoute from './src/routes/freeboard.js';
import fleamarketRoute from './src/routes/fleamarket.js';
import commentRoute from './src/routes/comment.js';
import favoriteRoute from './src/routes/favorite.js';
import errorHandler from './src/middlewares/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('default path');
});

app.use('/freeboard', freeboardRoute);
app.use('/fleamarket', fleamarketRoute);
app.use('/comment', commentRoute);
app.use('/user', userRoute);
app.use('/favorite', favoriteRoute);
app.use('/auth', authRoute);

app.use('/uploads', express.static('uploads'));

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
