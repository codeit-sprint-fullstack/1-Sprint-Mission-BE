const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 상품 등록
exports.createProduct = async (req, res, next) => {
  const { name, description, price, tags } = req.body;
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price, 10),
        tags,
        image: imagePaths,
        userId: req.user.id,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 상품 목록 조회 (정렬 및 검색 가능)
exports.getProducts = async (req, res, next) => {
  const {
    page = 1,
    pageSize = 10,
    orderBy = "recent",
    keyword = "",
  } = req.query;

  let sortBy = {};
  if (orderBy === "recent") {
    sortBy = { createdAt: "desc" };
  } else if (orderBy === "favorite") {
    sortBy = { likes: { _count: "desc" } };
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
    res.status(200).json(products);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 특정 상품 조회
exports.getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        likes: true,
        comments: true,
      },
    });
    if (!product)
      return res.status(404).json({ error: "해당 상품을 찾을 수 없습니다." });

    const isLiked = product.likes.some((like) => like.userId === req.user.id);

    res.status(200).json({ ...product, isLiked });
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 상품 수정
exports.updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, tags } = req.body;
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, price, tags, image: imagePaths },
    });
    res.status(200).json(product);
  } catch (error) {
    next(error); // 에러 전달
  }
};

// 상품 삭제
exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "상품이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error); // 에러 전달
  }
};
