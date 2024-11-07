import { NextFunction, Request, Response } from "express";
import { assert } from "superstruct";
import {
  CreateArticle,
  createArticle,
  UpdateArticle,
  updateArticle,
} from "../struct/article-struct";
import {
  CreateArticleComment,
  createArticleComment,
  CreateProductComment,
  createProductComment,
  UpdateComment,
  updateComment,
} from "../struct/comment-struct";
import {
  CreateProduct,
  createProduct,
  UpdateProduct,
  updateProduct,
} from "../struct/product-struct";
import { SignIn, signInUser, SignUp, signUpUser } from "../struct/user-struct";
import {
  createArticleLike,
  CreateArticleLike,
  createProductLike,
  CreateProductLike,
} from "../struct/like-struct";

type Method = "post" | "patch";
type EntityType = "article" | "product";

function article(method: Method) {
  return (
    req: Request<{ id: string }, {}, CreateArticle | UpdateArticle>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (method === "post") {
        assert(req.body, createArticle);
        next();
      } else if (method === "patch") {
        assert(req.body, updateArticle);
        next();
      }
    } catch (err) {
      return next(err);
    }
  };
}

function comment(method: Method, type: EntityType) {
  return (
    req: Request<
      { id: string },
      {},
      CreateArticleComment | CreateProductComment | UpdateComment
    >,
    res: Response,
    next: NextFunction
  ) => {
    if (method === "post") {
      const { id } = req.params;

      if (type === "article") {
        const createDataWithId = { ...req.body, articleId: id };
        assert(createDataWithId, createArticleComment);
        req.body = createDataWithId;
        next();
      } else if (type === "product") {
        const createDataWithId = { ...req.body, productId: id };
        assert(createDataWithId, createProductComment);
        req.body = createDataWithId;
        next();
      }
    } else if (method === "patch") {
      assert(req.body, updateComment);
      next();
    }
  };
}

function product(method: Method) {
  return (
    req: Request<{ id: string }, {}, CreateProduct | UpdateProduct>,
    res: Response,
    next: NextFunction
  ) => {
    if (method === "post") {
      assert(req.body, createProduct);
      next();
    } else if (method === "patch") {
      assert(req.body, updateProduct);
      next();
    }
  };
}

function signUp() {
  return (req: Request<{}, {}, SignUp>, res: Response, next: NextFunction) => {
    assert(req.body, signUpUser);
    next();
  };
}

function signIn() {
  return (req: Request<{}, {}, SignIn>, res: Response, next: NextFunction) => {
    assert(req.body, signInUser);
    next();
  };
}

function like(type: EntityType) {
  return (
    req: Request<{ id: string }, {}, CreateArticleLike | CreateProductLike>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    if (type === "article") {
      const articleLikeData = { articleId: id };
      assert(articleLikeData, createArticleLike);
      req.body = articleLikeData;
      next();
    } else if (type === "product") {
      const productLikeData = { productId: id };
      assert(productLikeData, createProductLike);
      req.body = productLikeData;
      next();
    }
  };
}

export default {
  article,
  comment,
  product,
  signUp,
  signIn,
  like,
};
