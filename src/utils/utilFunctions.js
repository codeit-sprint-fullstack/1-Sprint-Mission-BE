export function filterUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}
