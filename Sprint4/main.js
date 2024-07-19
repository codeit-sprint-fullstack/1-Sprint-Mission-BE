import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from "./ProductService.js";
import { checkStatus, getArticle, getArticleList, createArticle,patchArticle,deleteArticle } from "./ArticleService.js";

const newProduct = {
    "name": "텀블러",
    "description": "스타벅스 텀블러",
    "price": 15000,
    "manufacturer": "manufacturer",
    "tags": [
      "게임기",
      "닌텐도"
    ],
    "images": [
      "string"
    ],
  };
  
  const newArticle = {
    "title":"레인부츠 리뷰",
    "content":"튼튼한 레인부츠 신어본 후기",
    "image":"string",
  };