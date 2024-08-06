import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Data } from './mock.js';
import Product from '../models/Product.js';

dotenv.config(); // .env 파일에서 환경 변수를 로드

const DATABASE_URL = process.env.DATABASE_URL;