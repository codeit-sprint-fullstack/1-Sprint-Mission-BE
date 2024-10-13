import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import articleRoutes from './routes/articles.js';
import productRoutes from './routes/products.js';
import articleCommentRoutes from './routes/articleComments.js';
import productCommentRoutes from './routes/productComments.js';
import uploadRoutes from './routes/uploads.js';
import authRoutes from './routes/auth.js';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

app.use('/articles', articleRoutes);
app.use('/articles/:articleId/comments', articleCommentRoutes);
app.use('/products', productRoutes);
app.use('/products/:productId/comments', productCommentRoutes);
app.use('/upload', uploadRoutes);
app.use('/auth', authRoutes);

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
