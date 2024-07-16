import * as ArticleService from './ArticleService.js';
import * as ProductService from './ProductService.js';

// ArticleService.getArticleList();
// ArticleService.getArticleList({page: 1, pageSize: 30, keyword: '추천'});

// ArticleService.getArticle(5);

// const articleContent = {
//   "title": "stringTitle",
//   "content": "stringContent",
//   "image": "stringImage", 
// };

// ArticleService.createArticle(articleContent);

// const updateContent = {
//   "title": "patchTitle",
//   "content": "patchContent",
//   "image": "patchImage",
// };

// ArticleService.patchArticle(37, updateContent);

// ArticleService.deleteArticle(37);

// ProductService.getProductList();
// ProductService.getProductList({page: 1, pageSize: 30, keyword: '삼성'});

// ProductService.getProduct(5);

const productContent = {
  "name": "삼성 마이크",
  "description": "삼성 USB 마이크",
  "price": 90000,
  "tags": ["전자제품", "삼성"],
  "images": ["image_url"],
};

ProductService.createProduct(productContent);