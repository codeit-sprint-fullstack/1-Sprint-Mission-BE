export const validateUser = (req, res, next) => {
  const { email, encryptedPassword, nickname } = req.body;

  if (!email || email.trim() === '') {
    const error = new Error('이메일은 필수입니다.');
    error.code = 400;
    error.status = 400;
    throw error;
  }

  if (!encryptedPassword || encryptedPassword.trim() === '') {
    const error = new Error('비밀번호는 필수입니다.');
    error.code = 400;
    error.status = 400;
    throw error;
  }

  if (!nickname || nickname.trim() === '') {
    const error = new Error('닉네임은 필수입니다.');
    error.code = 400;
    error.status = 400;
    throw error;
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, encryptedPassword } = req.body;

  if (!email || email.trim() === '') {
    const error = new Error('이메일은 필수입니다.');
    error.code = 400;
    error.status = 400;
    throw error;
  }

  if (!encryptedPassword || encryptedPassword.trim() === '') {
    const error = new Error('비밀번호는 필수입니다.');
    error.code = 400;
    error.status = 400;
    throw error;
  }

  next();
};
