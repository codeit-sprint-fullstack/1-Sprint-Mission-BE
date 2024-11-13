export function createCustomError({ status, message }) {
  const err = new Error(message);
  err.status = status;
  return err;
}
