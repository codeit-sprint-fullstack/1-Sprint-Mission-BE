const { User, Product } = require("../models");
const { Op } = require("sequelize");

exports.getMe = async (req, res) => {
  res.json(req.user);
};

exports.updateMe = async (req, res) => {
  const { image } = req.body;
  await req.user.update({ image });
  res.json(req.user);
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, password, passwordConfirmation } = req.body;

  if (password !== passwordConfirmation) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const isMatch = await bcrypt.compare(currentPassword, req.user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await req.user.update({ password: hashedPassword });

  res.json(req.user);
};

exports.getMyProducts = async (req, res) => {
  const { page = 1, pageSize = 10, keyword } = req.query;
  const offset = (page - 1) * pageSize;

  const where = { UserId: req.user.id };
  if (keyword) {
    where.name = { [Op.iLike]: `%${keyword}%` };
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    limit: parseInt(pageSize),
    offset,
    order: [["createdAt", "DESC"]],
  });

  res.json({
    totalCount: count,
    list: rows,
  });
};
