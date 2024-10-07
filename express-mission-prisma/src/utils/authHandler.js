function filterSensitiveUserData(authResult) {
  const { encryptedPassword, ...rest } = authResult;
  return rest;
}



export default {
  filterSensitiveUserData,
};
