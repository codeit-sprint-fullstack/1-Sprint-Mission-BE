const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createProductComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { productId } = req.params;
    const comment = await prisma.comment.create({
      data: { content, productId: parseInt(productId) }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createArticleComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { articleId } = req.params;
    const comment = await prisma.comment.create({
      data: { content, articleId: parseInt(articleId) }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await prisma.comment.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProductComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const { cursor, pageSize = 10 } = req.query;
    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(productId) },
      skip: cursor ? 1 : 0,
      take: parseInt(pageSize, 10),
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ list: comments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getArticleComments = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { cursor, pageSize = 10 } = req.query;
    const comments = await prisma.comment.findMany({
      where: { articleId: parseInt(articleId) },
      skip: cursor ? 1 : 0,
      take: parseInt(pageSize, 10),
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ list: comments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

