export const validateUserMiddleware = (req, res, next) => {
  const { email, encryptedPassword, nickname } = req.body;
  if (!email || !encryptedPassword || !nickname) {
    return res
      .status(400)
      .json({ message: 'Email and password, nickname are required.' });
  }
  next();
};

export const validateLoginMiddleware = (req, res, next) => {
  const { email, encryptedPassword } = req.body;
  if (!email || !encryptedPassword) {
    return res
      .status(400)
      .json({ message: 'Email and password are required.' });
  }
  next();
};
