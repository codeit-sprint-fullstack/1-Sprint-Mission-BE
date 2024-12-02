export class CustomError_Class extends Error {
  code: number | string;
  status: number;

  constructor(message: string, code: number, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const createError = (message: string, code: number, status: number) => {
  const error = new CustomError_Class(message, code, status);
  throw error;
};
