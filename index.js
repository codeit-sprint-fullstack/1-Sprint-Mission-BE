import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import productRoutes from './routes/products_mongoose.js';
import articleRoutes from './routes/articles.js';
import commentRoutes from './routes/comments.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
