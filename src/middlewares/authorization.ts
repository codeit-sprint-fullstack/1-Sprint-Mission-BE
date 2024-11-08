import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
// import commentRepository from "../repositories/commentRepository.js";
// import productRepositpry from "../repositories/productRepositpry.js";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { CustomError } from "./error-handler";
import articleRepository from "../repositories/article-repository";
import { UpdateArticle } from "../struct/article-struct";
import { UpdateProduct } from "../struct/product-struct";
import productRepository from "../repositories/product-repository";

type Decoded = {
  userId: string;
  ist: number;
  exp: number;
};

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
}) as unknown as RequestHandler;

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies?.refreshToken,
}) as unknown as RequestHandler;

function attachUserId(req: Request, res: Response, next: NextFunction) {
  if (req.auth) {
    req.body.userId = req.auth.userId;
  }
  next();
}

function setUserIdFromToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (token) {
      const decoded = jwt.decode(token) as Decoded | null;
      if (decoded) {
        req.body.userId = decoded.userId;
        return next();
      } else {
        const error: CustomError = new Error("Invalid token format.");
        error.status = 401;
        return next(error);
      }
    }

    req.body.userId = null;
    next();
  } catch (err) {
    return next(err);
  }
}

async function verifyArticleAuth(
  req: Request<{ id: string }, {}, UpdateArticle>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: articleId } = req.params;
    const article = await articleRepository.findUniqueOrThrowtData({
      where: { id: articleId },
    });

    if (article.userId !== req.auth?.userId) {
      const error: CustomError = new Error("Forbidden");
      error.status = 403;
      return next(error);
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

// async function verifyCommentAuth(req, res, next) {
//   try {
//     const { id } = req.params;
//     const comment = await commentRepository.getById(id);

//     if (comment.userId !== req.auth.userId) {
//       const error = new Error("Forbidden");
//       error.code = 403;
//       throw error;
//     }

//     return next();
//   } catch (error) {
//     return next(error);
//   }
// }

async function verifyProductAuth(
  req: Request<{ id: string }, {}, UpdateProduct>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: productId } = req.params;
    const product = await productRepository.findUniqueOrThrowtData({
      where: { id: productId },
    });

    if (product.userId !== req.auth?.userId) {
      const error: CustomError = new Error("Forbidden");
      error.status = 403;
      return next(error);
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
  //   verifyCommentAuth,
  verifyProductAuth,
};
