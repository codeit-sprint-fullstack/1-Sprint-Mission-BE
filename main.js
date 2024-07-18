import { deleteArticle } from './ArticleService.js';

deleteArticle(128)
    .then(() => console.log('게시글이 삭제되었습니다.'))
    .catch(error => console.error('게시글을 삭제하는 중 에러 발생:', error));

