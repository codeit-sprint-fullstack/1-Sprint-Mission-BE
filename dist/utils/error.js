export class CustomError_Class extends Error {
    code;
    status;
    constructor(message, code, status) {
        super(message);
        this.code = code;
        this.status = status;
    }
}
export const createError = (message, code, status) => {
    const error = new CustomError_Class(message, code, status);
    throw error;
};
