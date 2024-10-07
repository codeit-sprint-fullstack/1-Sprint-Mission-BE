import { expressjwt } from "express-jwt";
import articleRepository from "../repositories/articleRepository.js";
import commentRepository from "../repositories/commentRepository.js";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

function attachUserId(req, res, next) {
  if (req.auth) {
    req.body.userId = req.auth.userId;
  }
  next();
}

async function verifyArticleAuth(req, res, next) {
  try {
    const { id } = req.params;
    const article = await articleRepository.getById(id);

    if (article.userId !== req.auth.userId) {
      const error = new Error('Forbidden');
      error.code = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

async function verifyCommentAuth(req, res, next) {
  try {
    const { id } = req.params;
    const comment = await commentRepository.getById(id);

    if (comment.userId !== req.auth.userId) {
      const error = new Error('Forbidden');
      error.code = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}


export { verifyAccessToken, attachUserId, verifyArticleAuth, verifyCommentAuth };
