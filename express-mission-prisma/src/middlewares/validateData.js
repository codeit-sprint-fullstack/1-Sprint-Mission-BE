import { assert } from "superstruct";
import { createArticle, updateArticle } from "../structs/articleStruct.js";
import {
  createArticleComment,
  createProductComment,
  updateComment,
} from "../structs/commentStruct.js";
import { createProduct } from "../structs/productStruct.js";
import { singUpUser } from "../structs/userStruct.js";

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
      let createDataWithId;

      if (type === "article") {
        createDataWithId = { ...req.body, articleId: id };
        assert(createDataWithId, createArticleComment);
        req.createData = createDataWithId;
        next();
      } else if (type === "product") {
        createDataWithId = { ...req.body, productId: id };
        assert(createDataWithId, createProductComment);
        req.createData = createDataWithId;
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

export default {
  article,
  comment,
  product,
  singUp,
};
