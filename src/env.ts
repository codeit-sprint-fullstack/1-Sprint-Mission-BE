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

export default { dbUrl, awsUrl, product, baseUrl };
