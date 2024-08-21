import express from 'express';
import {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticles,
} from '../models/Article.js';

const router = express.Router();

// 등록 API
router.post('/', async (req, res) => {
  try {
    const article = await createArticle(req.body);
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// 조회 API
router.get('/:id', async (req, res) => {
  try {
    const article = await getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// 수정 API
router.patch('/:id', async (req, res) => {
  try {
    const article = await updateArticle(req.params.id, req.body);
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// 삭제 API
router.delete('/:id', async (req, res) => {
  try {
    await deleteArticle(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// 게시글 목록 조회 API
router.get('/', async (req, res) => {
  const { search, page = 1, pageSize = 10, sort = 'recent' } = req.query;
  try {
    const skip = (page - 1) * pageSize;
    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        }
      : {};

    const orderBy = sort === 'recent' ? { createdAt: 'desc' } : undefined;

    const articles = await getArticles({
      where,
      orderBy,
      skip: parseInt(skip, 10),
      take: parseInt(pageSize, 10),
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

export default router;
