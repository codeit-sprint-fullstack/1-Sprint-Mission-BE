const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes'); // 상품 관련 경로 설정 파일 불러오기
const articleRoutes = require('./routes/articleRoutes'); // 게시글 관련 경로 설정 파일 불러오기
const commentRoutes = require('./routes/commentRoutes'); // 댓글 관련 경로 설정 파일 불러오기

dotenv.config();  // .env 파일에 정의된 환경변수를 불러와 사용 가능하게 함

const app = express(); // Express 애플리케이션 생성
app.use(cors());  // 모든 도메인에서 요청 허용 (일시적으로 테스트)
app.use(express.json()); // 클라이언트로부터 들어오는 JSON 데이터를 파싱하는 미들웨어 설정

// 각 경로에 대해 라우트 설정
app.use('/api/products', productRoutes);  // /api/products 경로로 들어오는 요청은 productRoutes에서 처리
app.use('/api/articles', articleRoutes);  // /api/articles 경로로 들어오는 요청은 articleRoutes에서 처리
app.use('/api/comments', commentRoutes);  // /api/comments 경로로 들어오는 요청은 commentRoutes에서 처리

// 서버가 실행될 포트를 환경변수 또는 5001번 포트로 설정
const PORT = process.env.PORT || 5001;

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

