const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 회원가입
exports.signUp = async (req, res, next) => {
  const { email, password, nickname } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });

    // JWT 토큰 발급
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // accessToken과 nickname 반환
    res.status(201).json({ accessToken: token, nickname: user.nickname });
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 로그인
exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // JWT 토큰 발급
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // accessToken과 nickname 반환
    res.status(200).json({ accessToken: token, nickname: user.nickname });
  } catch (error) {
    next(error); // 에러 전달
  }
};

