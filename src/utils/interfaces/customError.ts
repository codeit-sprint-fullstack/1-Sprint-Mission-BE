export interface CustomError extends Error {
  status?: number;
  data?: { [key: string]: string };
}
