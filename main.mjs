import * as article from './api/articleService.mjs';
import * as product from './api/productService.mjs';

// - get all articles with parameters
// article.getArticleList({
//   page: 1,
//   pageSize: 1,
//   keyword: '기구',
// });

// article.getArticleList();

// - get an article by id (if no id existed (404), it throws error)
// article.getArticle(11);

// - create new article
// article.createArticle('새 리뷰', '새리뷰입니다', '이미지주소');

//- update an article by id
// article.patchArticle(165, { title: '수정된 타이틀' });

//- delete the article by id
// article.deleteArticle(167);
