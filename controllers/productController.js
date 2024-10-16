const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 상품 등록
exports.createProduct = async (req, res, next) => {
  const { name, description, price, tags } = req.body;
  const images = req.body.images || [];
  console.log("사용자 정보:", req.user); // req.user 로그 추가

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price, 10),
        tags,
        image: images,
        userId: req.user.id,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// 상품 목록 조회
exports.getProducts = async (req, res, next) => {
  const { page = 1, pageSize = 10, orderBy = 'recent', keyword = '' } = req.query;

  let sortBy = {};
  if (orderBy === 'recent') {
    sortBy = { createdAt: 'desc' };
  } else if (orderBy === 'favorite') {
    sortBy = { likes: { _count: 'desc' } };
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      },
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize, 10),
      orderBy: sortBy,
      include: {
        likes: true,
        comments: true,
      },
    });

    const totalCount = await prisma.product.count({
      where: {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      },
    });

    res.status(200).json({ totalCount, list: products });
  } catch (error) {
    next(error);
  }
};

// 특정 상품 조회
exports.getProductById = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: {
        likes: true,
        comments: true,
      },
    });
    if (!product) {
      return res.status(404).json({ error: "해당 상품을 찾을 수 없습니다." });
    }

    const isFavorite = product.likes.some((like) => like.userId === req.user.id);
    res.status(200).json({ ...product, isFavorite });
  } catch (error) {
    next(error);
  }
};

// 상품 수정
exports.updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { name, description, price, tags } = req.body;
  const images = req.body.images || [];

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { name, description, price: parseInt(price, 10), tags, image: images },
    });
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// 상품 삭제
exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.params;

  try {
    await prisma.product.delete({
      where: { id: parseInt(productId) },
    });
    res.status(200).json({ id: productId });
  } catch (error) {
    next(error);
  }
};

