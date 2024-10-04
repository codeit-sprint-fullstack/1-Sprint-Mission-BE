const validateProductFields = (req, res, next) => {
  const { title, content, price } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: '상품 이름은 필수입니다.' });
  }

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: '상품 설명은 필수입니다.' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: '상품 가격은 0 이상이어야 합니다.' });
  }

  next();
};

export default validateProductFields;
