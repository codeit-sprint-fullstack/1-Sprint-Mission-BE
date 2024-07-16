import { getArticleList, getArticle } from './ArticleService.js'


getArticleList({page:1, pageSize:5})
  .then(result => {
    if (result) {
      console.log('ArticleList: ', JSON.stringify(result, null, 2));
    } else {
      console.log('No results returned');
    }
  })


getArticle(10)
  .then(result => {
    if (result) {
      console.log('Article: ', JSON.stringify(result, null, 2));
    } else {
      console.log('No results returned')
    }
  })