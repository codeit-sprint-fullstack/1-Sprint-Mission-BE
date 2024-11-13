export function authUserForm(data) {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user,
  };
}

export function authTokenForm(data) {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}
