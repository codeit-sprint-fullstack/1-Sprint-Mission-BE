import { getArticleList } from './ArticleService.js';

getArticleList()
    .then(data => console.log('게시글 목록:', data))
    .catch(error => console.error('게시글 목록을 가져오는 중 에러 발생:', error));
