import articleModel from "../model/articleModel";
import productModel from "../model/productModel";

const verifyProductAuth = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: productId } = req.params;

  try {
    const product = await productModel.getById(productId);

    if (!product) {
      const error = new Error("Review not found");
      error.code = 404;
      throw error;
    }

    if (product.ownerId !== userId) {
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const verifyArticleAuth = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: productId } = req.params;

  try {
    const article = await productModel.getById(productId);

    if (!article) {
      const error = new Error("Review not found");
      error.code = 404;
      throw error;
    }

    if (article.ownerId !== userId) {
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default {
  verifyProductAuth,
  verifyArticleAuth,
};
