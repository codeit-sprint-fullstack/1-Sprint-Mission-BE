const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');

// 현재 유저 정보 조회
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// 유저 정보 업데이트
exports.updateUser = async (req, res, next) => {
  const { image } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { image },
      select: {
        id: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// 비밀번호 변경
exports.updatePassword = async (req, res, next) => {
  const { currentPassword, password, passwordConfirmation } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ error: "현재 비밀번호가 올바르지 않습니다." });
    }

    if (password !== passwordConfirmation) {
      return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
      select: {
        id: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// 유저의 상품 목록 조회
exports.getUserProducts = async (req, res, next) => {
  const { page = 1, pageSize = 10, keyword = '' } = req.query;
  try {
    const products = await prisma.product.findMany({
      where: {
        userId: req.user.id,
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } }
        ],
      },
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize, 10),
      include: {
        likes: true
      }
    });

    const totalCount = await prisma.product.count({
      where: {
        userId: req.user.id,
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } }
        ],
      }
    });

    res.status(200).json({ totalCount, list: products });
  } catch (error) {
    next(error);
  }
};

// 유저의 좋아요 상품 목록 조회
exports.getUserFavorites = async (req, res, next) => {
  const { page = 1, pageSize = 10, keyword = '' } = req.query;
  try {
    const products = await prisma.product.findMany({
      where: {
        likes: {
          some: {
            userId: req.user.id,
          },
        },
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } }
        ],
      },
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize, 10),
      include: {
        likes: true
      }
    });

    const totalCount = await prisma.product.count({
      where: {
        likes: {
          some: {
            userId: req.user.id,
          },
        },
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } }
        ],
      }
    });

    res.status(200).json({ totalCount, list: products });
  } catch (error) {
    next(error);
  }
};

