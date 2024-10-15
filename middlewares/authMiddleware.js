// JWT 토큰을 검증하여 사용자가 인증된 상태인지 확인을 위한 미들웨어

import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // HTTP 요청의 Authorization 헤더에서 JWT 토큰을 추출
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      nickname: decoded.nickname, // nickname 추가
    }; // 인증 성공 시, 사용자 정보를 요청 객체에 추가
    console.log(req.user);
    next(); // 다음 미들웨어로 이동
  } catch (error) {
    return res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
};

export default authMiddleware;
