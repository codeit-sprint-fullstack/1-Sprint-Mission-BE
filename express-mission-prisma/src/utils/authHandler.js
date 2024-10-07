import bcrypt from "bcrypt";

function filterSensitiveUserData(authResult) {
  const { encryptedPassword, ...rest } = authResult;
  return rest;
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export { filterSensitiveUserData, hashPassword };
