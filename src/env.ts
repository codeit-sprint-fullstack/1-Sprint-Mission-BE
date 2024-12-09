import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.LOCALHOST_URL;
const awsUrl = process.env.AWS_URL;
const product = process.env.PRODUCT_CONDITION;

let baseUrl = "";
if (product === "Product") {
  baseUrl = awsUrl as string;
} else {
  baseUrl = dbUrl as string;
}

const AccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const SecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const BucketName = process.env.AWS_BUCKET_NAME;
const Region = process.env.AWS_REGION;
const AccessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const RefreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
export default {
  dbUrl,
  awsUrl,
  product,
  baseUrl,
  AccessKeyId,
  SecretAccessKey,
  BucketName,
  Region,
  AccessTokenSecret,
  RefreshTokenSecret,
};
