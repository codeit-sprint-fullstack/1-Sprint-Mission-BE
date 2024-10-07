import { assert } from "superstruct";
import { createArticle, updateArticle } from "../structs/articleStruct.js";
import {
  createArticleComment,
  createProductComment,
  updateComment,
} from "../structs/commentStruct.js";
import { createProduct } from "../structs/productStruct.js";
import { singInUser, singUpUser } from "../structs/userStruct.js";
import { createArticleLike, createProductLike } from "../structs/likeStruct.js";

function article(method) {
  return (req, res, next) => {
    if (method === "post") {
      assert(req.body, createArticle);
      next();
    } else if (method === "patch") {
      assert(req.body, updateArticle);
      next();
    }
  };
}

function comment(method, type) {
  return (req, res, next) => {
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

function product(method) {
  return (req, res, next) => {
    if (method === "post") {
      assert(req.body, createProduct);
      next();
    }
  };
}

function singUp() {
  return (req, res, next) => {
    assert(req.body, singUpUser);
    next();
  };
}

function singIn() {
  return (req, res, next) => {
    assert(req.body, singInUser);
    next();
  };
}

function like(type) {
  return (req, res, next) => {
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
  singUp,
  singIn,
  like,
};
