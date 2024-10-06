import passport from "../config/passport.js";
import * as productRepository from "../repositories/productRepository.js";

export const authentication = passport.authenticate("access-token", {
  session: false,
});

export async function productAuthorization() {
  return async (req, res, next) => {
    const { productId } = req.params;

    try {
      const product = await productRepository.getById(productId);

      if (!product) {
        const error = new Error("상품을 찾을 수 없습니다.");
        error.code = 404;
        next(error);
      }

      if (product.owner.id !== req.user.id) {
        const error = new Error("수정/ 삭제 권한이 없습니다.");
        error.code = 403;
        next(error);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
