import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer 토큰 형식에서 토큰 추출

  if (!token) return res.status(401).json({ message: "인증 토큰이 없습니다." });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "유효하지 않은 토큰입니다." });

    req.user = user;
    next();
  });
};

export default authenticateToken;
