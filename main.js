import { getArticle } from './ArticleService.js';

getArticle(41)
    .then(data => console.log('게시글:', data))
    .catch(error => console.error('게시글을 가져오는 중 에러 발생:', error));
