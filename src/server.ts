import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import errorHandler from './middleware/errorHandler';
import productsRoutes from './routes/productsRoutes';
import commentsRoutes from './routes/commentsRoutes';
import articleRoutes from './routes/articleRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', userRoutes); // 유저 회원가입, 로그인
app.use('/products', productsRoutes);
app.use('/products', commentsRoutes);
app.use('/articles', articleRoutes);
app.use('/articles', commentsRoutes);

// 404 Not Found 처리 미들웨어
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
});

// 에러 핸들러 등록
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
