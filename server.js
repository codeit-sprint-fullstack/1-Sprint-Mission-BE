import express from 'express';
import { DATABASE_URL } from './env.js';

const app = express();
app.use(express.json());

// MongoDB 연결
mongoose.connect(DATABASE_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.listen(3000, () => console.log('Server Started'));
