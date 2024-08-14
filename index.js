import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // 서버를 종료하여 문제가 해결될 때까지 서버가 실행되지 않도록 함
    });

// API 라우트 설정
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// 존재하지 않는 경로 처리
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found.' });
});

// 서버 포트 설정 및 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
