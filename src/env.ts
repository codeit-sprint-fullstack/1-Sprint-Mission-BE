import dotenv from 'dotenv';

dotenv.config();

export const databaseUrl = process.env.DATABASE_URL;
export const awsUrl = process.env.AWS_S3_URL;
export const productCondition = process.env.PRODUCT_PRODUCTCONDITION;

let baseUrl = '';
if (productCondition === 'Product') {
  baseUrl = awsUrl as string;
} else {
  baseUrl = databaseUrl as string;
}

export default { databaseUrl, awsUrl, productCondition, baseUrl };
