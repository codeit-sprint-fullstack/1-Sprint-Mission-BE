import { getArticleList } from './ArticleService.js'


getArticleList()
  .then(result => {
    if (result) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('No results returned');
    }
  })
