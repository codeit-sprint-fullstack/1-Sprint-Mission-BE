import * as article from './ArticleService.js'


article.getArticleList({page: 1, pageSize: 2})
  .then(result => {
    if (result) {
      console.log('ArticleList: ', result, '\n');
    } else {
      console.log('No results returned\n');
    }
  })


article.getArticle(10)
  .then(result => {
    if (result) {
      console.log('Article: ', result, '\n');
    } else {
      console.log('No results returned\n')
    }
  })


// const articles = [
//   {title: '감자', content: '[판다마켓] 강원도 감자(햇), 1kg', image: 'https://thumbnail7.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/6597174365713211-338aa9b8-a411-4d36-8127-24be7159bad0.jpg'},
//   {title: '피데기', content: '[판다마켓] 포항 구룡포 국내산 피데기 반건조오징어 10마리(700g 내외)', image: 'https://imagecdn.skstoa.com/goods/422/26466422_g.jpg'},
//   {title: '랍스타', content: '[판다마켓] 살아서 도착하는 캐나다산 활랍스타 1마리(1kg 내외)', image: 'https://sitem.ssgcdn.com/99/24/95/item/1000081952499_i1_750.jpg'},
// ]

// Promise.all(articles.map(article => article.createArticle(article)))
//   .then(results => {
//     results.forEach((result, idx) => {
//       if (result) {
//         console.log(`Article ${idx + 1} saved successfully:`, result);
//       } else {
//         console.log(`Failed to save Article ${idx + 1}`);
//       }
//     });
//   console.log('\n');  
//   });


const updateData = {
  title: '간장게장',
  content: '[판다마켓] 이하정간장게장, 1kg',
  image: 'https://img.siksinhot.com/place/1457073937720734.jpg',
}

article.patchArticle(50, updateData)
  .then((result) => {
    if (result) {
      console.log('Update Data: ', result);
    } else {
      console.log('Failed to update')
    }
    console.log('\n');
  });


  

