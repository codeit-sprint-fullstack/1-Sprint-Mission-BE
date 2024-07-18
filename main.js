import { patchArticle } from './ArticleService.js';

patchArticle(128, '수정된 게시글', '수정된 내용', '수정된_이미지_주소')
    .then(data => console.log('수정된 게시글:', data))
    .catch(error => console.error('게시글을 수정하는 중 에러 발생:', error));
