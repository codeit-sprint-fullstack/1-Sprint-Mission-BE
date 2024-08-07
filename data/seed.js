import mongoose from 'mongoose';
import data from './mock.js';
import Product from '../models/Product.js';
import { DATABASE_URL } from '../env.js';

mongoose.connect(DATABASE_URL);

await Product.deleteMany({});
await Product.insertMany(data);

mongoose.connection.close();
