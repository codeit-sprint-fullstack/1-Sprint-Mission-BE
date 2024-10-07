const accessTokenOption = {
  httpOnly: true,
  secure: true,
  maxAge: 1000 * 60 * 60, //1시간
};

const refreshTokenOption = {
  httpOnly: true,
  secure: true,
  maxAge: 1000 * 60 * 60 * 24, //1일,
};

export default {
  accessTokenOption,
  refreshTokenOption,
};
