import { expressjwt } from 'express-jwt';

//로그인 한 유저만 좋아요, 게시물 등록, 저회 가능하게끔
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

//리프레시 토큰으로 엑세스토큰 발급
const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.refreshToken,
});

//본인의 리뷰만 수정 및 삭제 할 수 있게 하기
const verifyProductAuth = async (req, res, next) => {
  const { id: productId } = req.params;

  try {
    const product = await prisma.fleaMarket.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!product) {
      const error = new Error('Product not found');
      error.code = 404;
      throw error;
    }

    if (product.authorId !== req.auth.userId) {
      const error = new Error('Forbidden');
      error.code = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default {
  verifyAccessToken,
  verifyRefreshToken,
  verifyProductAuth,
};
