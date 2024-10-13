import bcrypt from "bcrypt";

function filterSensitiveUserData(authResult) {
  const { encryptedPassword, refreshToken, ...rest } = authResult;
  return rest;
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(inputPassword, savedPassword) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
}

export { filterSensitiveUserData, hashPassword, verifyPassword };
