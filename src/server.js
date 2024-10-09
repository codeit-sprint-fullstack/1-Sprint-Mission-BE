import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import axios from 'axios';
import productsRoutes from './routes/productsRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';
import articleRoutes from './routes/articleRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', userRoutes); //유저 회원가입, 로그인

app.use('/products', productsRoutes);
app.use('/products', commentsRoutes);
app.use('/articles', articleRoutes);
app.use('/articles', commentsRoutes);
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
