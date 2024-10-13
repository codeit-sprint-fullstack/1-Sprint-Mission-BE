import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import articleRepository from "../repositories/articleRepository.js";
import commentRepository from "../repositories/commentRepository.js";
import productRepositpry from "../repositories/productRepositpry.js";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

function attachUserId(req, res, next) {
  if (req.auth) {
    req.body.userId = req.auth.userId;
  }
  next();
}

function setUserIdFromToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded) {
        req.body.userId = decoded.userId;
        return next();
      } else {
        const error = new Error("Invalid token format.");
        error.code = 401;
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
  }
  req.body.userId = null;
  next();
}

async function verifyArticleAuth(req, res, next) {
  try {
    const { id } = req.params;
    const article = await articleRepository.getById(id);

    if (article.userId !== req.auth.userId) {
      const error = new Error("Forbidden");
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
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

async function verifyProductAuth(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productRepositpry.getById(id);

    if (product.userId !== req.auth.userId) {
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export {
  verifyAccessToken,
  verifyRefreshToken,
  attachUserId,
  setUserIdFromToken,
  verifyArticleAuth,
  verifyCommentAuth,
  verifyProductAuth,
};
