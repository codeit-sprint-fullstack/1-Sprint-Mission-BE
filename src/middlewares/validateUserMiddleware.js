export const validateUserMiddleware = (req, res, next) => {
  const { email, encryptedPassword, nickname } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({ error: '이메일은 필수입니다.' });
  }

  if (!encryptedPassword || encryptedPassword.trim() === '') {
    return res.status(400).json({ error: '비밀번호는 필수입니다.' });
  }

  if (!nickname || nickname.trim() === '') {
    return res.status(400).json({ error: '닉네임은 필수입니다.' });
  }

  next();
};

export const validateLoginMiddleware = (req, res, next) => {
  const { email, encryptedPassword } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({ error: '이메일은 필수입니다.' });
  }

  if (!encryptedPassword || encryptedPassword.trim() === '') {
    return res.status(400).json({ error: '비밀번호는 필수입니다.' });
  }

  next();
};
