import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import articleRoutes from './routes/articles.js';
import commentRoutes from './routes/comments.js';

const app = express();
app.use(express.json());

app.use('/articles', articleRoutes);
app.use('/comments', commentRoutes);

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
