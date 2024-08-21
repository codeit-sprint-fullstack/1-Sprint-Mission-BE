import mongoose from 'mongoose';
import data from './mock.js';
import Product from '../models/Product.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.production' });

mongoose.connect(process.env.DATABASE_URL);

const { DATABASE_URL } = process.env;
console.log('MongoDB Database URL:', DATABASE_URL);

// await Product.deleteMany({});
await Product.insertMany(data);

mongoose.connection.close();
