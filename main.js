import * as ArticleService from './ArticleService.js';
import * as ProductService from './ProductService.js';

// ArticleService.getArticleList();
// ArticleService.getArticleList({page: 1, pageSize: 30, keyword: '추천'});

// ArticleService.getArticle(19);

// const articleContent = {
//   "title": "stringTitle",
//   "content": "stringContent",
//   "image": "stringImage", 
// };

// ArticleService.createArticle(articleContent);

// const articleUpdate = {
//   "title": "patchTitle",
//   "content": "patchContent",
//   "image": "patchImage",
// };

// ArticleService.patchArticle(37, articleUpdate);

// ArticleService.deleteArticle(37);

// ProductService.getProductList();
// ProductService.getProductList({page: 1, pageSize: 30, keyword: '삼성'});

// ProductService.getProduct(5);

const productContent = {
  "name": "test",
  "description": "test",
  "price": 12345,
  "tags": ["test1", "test2"],
  "images": ["test"],
};

ProductService.createProduct(productContent);

// const productUpdate = {
//   "name": "무농약 제주 당근",
//   "description": "제주산 유기농 흙당근",
//   "price": 20000,
//   "tags": ["채소", "국내산"],
//   "images": ["image_url"],
// };

// ProductService.patchProduct(13, productUpdate);

// ProductService.deleteProduct(14);
