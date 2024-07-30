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
//getProduct(21);

//상품 목록 가져오기
//getProductList(1, 1, '의자');

//새 상품 추가하기
//createProduct(newProduct);

//상품 업데이트 하기
//patchProduct(3, newProduct);

//상품 삭제하기
//deleteProduct(2);

/* -------------ArticleService.js 파일 함수 동작 확인------------- */

//게시글 목록 조회
//getArticleList(1, 1, '캐리어');

//게시글 상세 조회
//getArticle(9);

//새로운 게시글 등록
//createArticle(newArticle.title, newArticle.content, newArticle.image);

//게시글 수정
//patchArticle(13, newArticle);

//게시글 삭제
//deleteArticle(17);