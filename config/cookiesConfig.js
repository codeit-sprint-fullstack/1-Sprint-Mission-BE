const accessTokenOption = {
  httpOnly: true,
  secure: true,
  maxAge: 300000,
};

const refreshTokenOption = {
  httpOnly: true,
  secure: true,
  maxAge: 300000,
};

export default {
  accessTokenOption,
  refreshTokenOption,
};
