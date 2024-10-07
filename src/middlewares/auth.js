import passport from "../config/passport.js";
import { getArticleById } from "../repositories/articleRepository.js";
import { getCommentById } from "../repositories/commentRepository.js";
import { getProductById } from "../repositories/productRepository.js";

export const authentication = passport.authenticate("access-token", {
  session: false,
});

export async function productAuthorization() {
  return async (req, res, next) => {
    const { productId } = req.params;

    try {
      const product = await getProductById(productId);

      if (!product) {
        const error = new Error("상품을 찾을 수 없습니다.");
        error.code = 404;
        next(error);
      }

      if (product.owner.id !== req.user.id) {
        const error = new Error("수정 또는 삭제 권한이 없습니다.");
        error.code = 403;
        next(error);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export async function articleAuthorization() {
  return async (req, res, next) => {
    const { articleId } = req.params;

    try {
      const article = await getArticleById(articleId);

      if (!article) {
        const error = new Error("게시글을 찾을 수 없습니다.");
        error.code = 404;
        next(error);
      }

      if (article.owner.id !== req.user.id) {
        const error = new Error("수정 또는 삭제 권한이 없습니다.");
        error.code = 403;
        next(error);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
