import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import productRoutes from './routes/productRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

const app = express();
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);

app.listen(process.env.PORT || 3000, () => console.log('Server started'));
