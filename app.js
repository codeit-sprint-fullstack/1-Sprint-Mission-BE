import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import productRoutes from './routes/productRoutes.js';

const app = express();
app.use(express.json());

app.use('/api/products', productRoutes);

app.listen(process.env.PORT || 3000, () => console.log('Server started'));
