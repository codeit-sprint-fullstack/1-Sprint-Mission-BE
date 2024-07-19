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

/* ----------ProductService.js 파일 함수 동작 확인----------- */

// 특정 상품 정보 가져오기
//getProduct(3);

//상품 목록 가져오기
//getProductList(1, 1, '의자');

//새 상품 추가하기
//createProduct(newProduct);

//상품 업데이트 하기
//patchProduct(3, newProduct);

//상품 삭제하기
//deleteProduct(2);