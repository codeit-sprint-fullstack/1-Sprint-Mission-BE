import passport from "../config/passport.js";
import { getArticleById } from "../repositories/articleRepository.js";
import { getCommentById } from "../repositories/commentRepository.js";
import { getProductById } from "../repositories/productRepository.js";

export const authentication = passport.authenticate("access-token", {
  session: false,
});

export async function productAuthorization(req, res, next) {
  try {
    const { productId } = req.params;
    if (!req.user) {
      const error = new Error("사용자가 없음");
      error.code = 400;
      return next(error);
    }

    const product = await getProductById(productId);

    if (!product) {
      const error = new Error("상품을 찾을 수 없습니다.");
      error.code = 404;
      return next(error);
    }

    if (product.owner.id !== req.user.id) {
      const error = new Error("수정 또는 삭제 권한이 없습니다.");
      error.code = 403;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export async function articleAuthorization(req, res, next) {
  try {
    const { articleId } = req.params;

    if (!req.user) {
      const error = new Error("사용자가 없음");
      error.code = 400;
      return next(error);
    }

    const article = await getArticleById(articleId);

    if (!article) {
      const error = new Error("게시글을 찾을 수 없습니다.");
      error.code = 404;
      return next(error);
    }

    if (article.writer.id !== req.user.id) {
      const error = new Error("수정 또는 삭제 권한이 없습니다.");
      error.code = 403;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
}
