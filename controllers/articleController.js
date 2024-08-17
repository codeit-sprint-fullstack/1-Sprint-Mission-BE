const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content }
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const { orderBy, page = 1, pageSize = 10, keyword = '' } = req.query;
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } }
        ]
      },
      orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : {},
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize, 10)
    });
    res.status(200).json({ list: articles });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await prisma.article.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await prisma.article.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    await prisma.article.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

