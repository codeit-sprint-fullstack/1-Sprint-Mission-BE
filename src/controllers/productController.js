const { sequelize, Product, User, Comment } = require("../models");

exports.getAllProducts = async (req, res) => {
  try {
    console.log("Fetching all products...");
    const products = await Product.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "nickname", "image"],
          required: false,
        },
        {
          model: Comment,
          required: false,
        },
      ],
      logging: console.log,
    });
    console.log(`Found ${products.length} products`);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "서버 에러", error: error.toString() });
  }
};

exports.getProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByPk(productId, {
      include: [
        { model: User, attributes: ["nickname", "image"] },
        { model: Comment },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "서버 에러", error });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, images, tags } = req.body;
  const userId = req.user.id;
  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      images: images || [],
      tags: tags || [],
      UserId: userId,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "제품 생성 실패", error });
  }
};

exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, images, tags } = req.body;
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
    }

    if (product.UserId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "본인 제품만 수정할 수 있습니다." });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.images = images || product.images;
    product.tags = tags || product.tags;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "제품 수정 실패", error });
  }
};

exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
    }

    if (product.UserId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "본인 제품만 삭제할 수 있습니다." });
    }

    await product.destroy();
    res.status(200).json({ message: "제품 삭제 완료" });
  } catch (error) {
    res.status(500).json({ message: "제품 삭제 실패", error });
  }
};
