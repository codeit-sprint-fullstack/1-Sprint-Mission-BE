import express from 'express';
import {
  createComment,
  getCommentsByArticleId,
  updateComment,
  deleteComment,
} from '../models/Comment.js';

const router = express.Router();

// 등록 API
router.post('/', async (req, res) => {
  try {
    const comment = await createComment(req.body);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// 특정 게시글의 댓글 목록 조회 API
router.get('/article/:articleId', async (req, res) => {
  const { cursor } = req.query;
  try {
    const take = 10;
    const cursorObj = cursor ? { id: parseInt(cursor, 10) } : undefined;

    const comments = await getCommentsByArticleId(req.params.articleId, {
      orderBy: { createdAt: 'desc' },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursorObj,
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// 수정 API
router.patch('/:id', async (req, res) => {
  try {
    const comment = await updateComment(req.params.id, req.body);
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// 삭제 API
router.delete('/:id', async (req, res) => {
  try {
    await deleteComment(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
