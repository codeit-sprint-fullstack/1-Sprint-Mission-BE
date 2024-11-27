const MIN_LENGTH_NAME: number = 1;
const MAX_LENGTH_NAME: number = 50;
const MIN_LENGTH_DESCRIPTION: number = 1;
const MAX_LENGTH_DESCRIPTION: number = 1024;
const MIN_VALUE_PRICE: number = 1;
const MAX_VALUE_PRICE: number = 9999999999;

export const productSchema = {
  MIN_LENGTH_NAME,
  MAX_LENGTH_NAME,
  MIN_LENGTH_DESCRIPTION,
  MAX_LENGTH_DESCRIPTION,
  MIN_VALUE_PRICE,
  MAX_VALUE_PRICE,
};

export const DEFAULT_PRODUCT_TAKE: number = 10;
export const DEFAULT_COMMENT_TAKE: number = 100;
