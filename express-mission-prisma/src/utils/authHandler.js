function filterSensitiveUserData(authResult) {
  const { password, ...rest } = authResult;
  return rest;
}

export default {
    filterSensitiveUserData
}