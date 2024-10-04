const jwt = require('jsonwebtoken');

// JWT 인증 미들웨어
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: '접근이 거부되었습니다.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: '유효한 토큰이 만료되었습니다.' });
  }
};

module.exports = authMiddleware;

