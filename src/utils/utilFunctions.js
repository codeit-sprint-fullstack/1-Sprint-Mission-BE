export function filterUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

export function checkEntityName(idParamName) {
  let whichEntity;
  switch (idParamName) {
    case 'articleId':
      whichEntity = 'article';
      break;
    case 'productId':
      whichEntity = 'product';
      break;
    default:
      const error = new Error('유효한 id param이 아님.');
      error.code = 400;
      throw error;
  }
  return whichEntity;
}
