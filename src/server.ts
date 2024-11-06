import dotenv from 'dotenv';
import app from './app';

dotenv.config();
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
