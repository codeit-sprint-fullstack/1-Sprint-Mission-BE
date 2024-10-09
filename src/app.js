import * as dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import passport from './config/passport.js';
import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRouter.js';
import productRouter from './routers/productRouter.js';
import articleRouter from './routers/articleRouter.js';
import commentRouter from './routers/commentRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.use('/images', express.static('uploads'));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/products', productRouter);
app.use('/api/articles', articleRouter);
app.use('/api', commentRouter);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log('Server started'));
