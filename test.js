import { createToken } from "./src/services/authService.js";

const user = {
  id: 1,
};
try {
  const accessToken = createToken(user);
  const refreshToken = createToken(user, "refresh");
  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);
} catch (e) {
  console.error(e);
}
