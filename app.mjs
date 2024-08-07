import express from 'express';
import cors from 'cors';
import './loadEnvironment.mjs';
import './db/conn.mjs';

import productRoutes from './routes/productRoutes.mjs';

const app = express();
app.use(cors());
app.use(express.json());

//product routes
app.use('/api/products', productRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
