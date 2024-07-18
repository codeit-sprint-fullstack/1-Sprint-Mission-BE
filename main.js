import { createArticle } from './ArticleService.js';

createArticle('새 게시글', '이것은 내용입니다', '이미지_주소')
    .then(data => console.log('생성된 게시글:', data))
    .catch(error => console.error('게시글을 생성하는 중 에러 발생:', error));
