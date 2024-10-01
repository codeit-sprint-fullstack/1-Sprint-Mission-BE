const AuthMiddleware = (req, res, next) => {
  const token = req.accessToken;

  // 토큰을 받아와서

  //토큰을 비교 후

  //회원 정보 갖고 오기

  req.user = user;
  serSchema.statics.findByToken = function (token, callback) {
    const user = this;
  };

  // jwt.verify(token, 'sectetKey', )
  
  next();
};

export default AuthMiddleware;
