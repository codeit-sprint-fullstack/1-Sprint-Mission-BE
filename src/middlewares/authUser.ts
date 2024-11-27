import articleRepository from "../repositorys/articleRepository";
import productRepository from "../repositorys/productRepository";
import commentRepository from "../repositorys/commentRepository";
import { RequestHandler } from "express";
import { CustomError } from "../utils/interfaces/customError";
import userRepository from "../repositorys/userRepository";

const verifyProductAuth: RequestHandler = async (req, res, next) => {
  const { id: userId } = req.user as { id: string };
  const { id: productId } = req.params;

  try {
    const product = await productRepository.getById(productId);

    if (!product) {
      const error: CustomError = new Error("Review not found");
      error.status = 404;
      throw error;
    }

    if (product.ownerId !== userId) {
      const error: CustomError = new Error("Forbidden");
      error.status = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const verifyArticleAuth: RequestHandler = async (req, res, next) => {
  const { id: userId } = req.user as { id: string };
  const { id: ArticleId } = req.params;

  try {
    const article = await articleRepository.findById(ArticleId);

    if (!article) {
      const error: CustomError = new Error("Review not found");
      error.status = 404;
      throw error;
    }

    if (article.ownerId !== userId) {
      const error: CustomError = new Error("Forbidden");
      error.status = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const verifyCommentAuth: RequestHandler = async (req, res, next) => {
  const { id: userId } = req.user as { id: string };
  const { id: commentId } = req.params;

  try {
    const comment = await commentRepository.getById(commentId);

    if (!comment) {
      const error: CustomError = new Error("Review not found");
      error.status = 404;
      throw error;
    }

    if (comment.userId !== userId) {
      const error: CustomError = new Error("Forbidden");
      error.status = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const verifyUserSignup: RequestHandler = async (req, res, next) => {
  const { email, password, nickname } = req.body;

  const emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
  const passwordPattern =
    /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

  try {
    if (!email || !nickname || !password) {
      const error: CustomError = new Error("Bad Request");
      error.status = 400;
      error.data = {
        message: "이메일, 닉네임, 비밀번호는 필수 값입니다.",
      };
      throw error;
    }

    if (!emailPattern.test(email)) {
      const error: CustomError = new Error("Bad Request");
      error.status = 400;
      error.data = {
        message: "이메일 형식을 확인해 주세요",
      };
      throw error;
    }

    const existedUser = await userRepository.findByEmail(email);
    if (existedUser) {
      const error: CustomError = new Error("Unprocessable Entity");
      error.status = 422;
      error.data = {
        message: "사용중인 이메일입니다.",
        email,
      };
      throw error;
    }

    if (!passwordPattern.test(password)) {
      const error: CustomError = new Error("Bad Request");
      error.status = 400;
      error.data = {
        message: "비밀번호는 영문 + 특수문자 + 숫자의 조합이 필요합니다.",
        password,
      };
      throw error;
    }

    if (
      typeof nickname !== "string" ||
      nickname.length < 1 ||
      nickname.length > 10
    ) {
      const error: CustomError = new Error("Bad Request");
      error.status = 400;
      error.data = {
        message: "닉네임은 1자 이상 10자 미만 입니다.",
        nickname,
      };
      throw error;
    }
  } catch (error) {
    return next(error);
  }

  next();
};

export default {
  verifyProductAuth,
  verifyArticleAuth,
  verifyCommentAuth,
  verifyUserSignup,
};
