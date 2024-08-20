const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const articleRoutes = require('./routes/articleRoutes');
const commentRoutes = require('./routes/commentRoutes');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://rimmymarket.netlify.app'
}));
app.use(express.json());

app.use('/api', productRoutes);
app.use('/api', articleRoutes);
app.use('/api', commentRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

