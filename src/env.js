"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productCondition = exports.awsUrl = exports.databaseUrl = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.databaseUrl = process.env.DATABASE_URL;
exports.awsUrl = process.env.AWS_S3_URL;
exports.productCondition = process.env.PRODUCT_PRODUCTCONDITION;
let baseUrl = '';
if (exports.productCondition === 'Product') {
    baseUrl = exports.awsUrl;
}
else {
    baseUrl = exports.databaseUrl;
}
exports.default = { databaseUrl: exports.databaseUrl, awsUrl: exports.awsUrl, productCondition: exports.productCondition, baseUrl };
