const accessTokenOption = {
  httpOnly: true,
  secure: false,
  maxAge: 3600000,
};

const refreshTokenOption = {
  httpOnly: true,
  secure: false,
  maxAge: 86400000,
};

export default {
  accessTokenOption,
  refreshTokenOption,
};
