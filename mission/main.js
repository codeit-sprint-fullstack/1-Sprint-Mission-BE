import * as articles from './ArticleService.js'
import * as product from './ProductService.js'

// 어떻게 확인하실 지 몰라 일단 다 주석처리했습니다.
// ps. node.js로 확인하는 걸로 알고있어 이렇게 작성했습니다. 터미널에 npm start를 쓰시면 main.js가 작동할겁니다.

// // GET List(articles)

// const params = {
//     page: 1, 
//     pageSize: 100, 
//     keyword: '',
// };

// articles.getArticleList(params)
//     .then((res) => {
//         if(!res.ok) {
//             throw new Error('데이터를 불러오는데 실패했습니다.');
//         }
//         return res.json();
//     })
//     .then((data) => {
//         console.log('fetch를 이용한 GET_LIST 함수입니다.')
//         console.log('성공');
//         console.log(data);
//     })
//     .catch((e) => {
//         console.log('fetch를 이용한 GET_LIST 함수입니다.')
//         console.log('Erorr');
//         console.log(e.message);
//     });


// //GET(articles)

// articles.getArticle(1)
//     .then((res) => {
//         if(!res.ok) {
//             throw new Error('게시글을 찾을 수 없습니다.')
//         }
//         return res.json();
//     })
//     .then((data) => {
//         console.log('fetch를 이용한 GET(id) 함수입니다.')
//         console.log('성공');
//         console.log(data);
//     })
//     .catch((e) => {
//         console.log('fetch를 이용한 GET(id) 함수입니다.')
//         console.log('Erorr');
//         console.log(e.message);
//     });


// // POST(articles)

// const article_data = {
//     title: 'test', 
//     content: 'test',
//     image: '',
// };

// articles.createArticle(article_data)
//     .then((res) => {
//         if(!res.ok) {
//             throw new Error('유효성 검사 오류');
//         }
//         return res.json();
//     })
//     .then((data) => {
//         console.log('fetch를 이용한 POST 함수입니다.')
//         console.log('성공');
//         console.log(data);
//     })
//     .catch((e) => {
//         console.log('fetch를 이용한 POST 함수입니다.')
//         console.log('Erorr');
//         console.log(e.message);
//     });


// // PATCH(articles)

// const patch_data = {
//     title: 'test', 
//     content: '0',
//     image: '',
// };

// articles.patchArticle(5, patch_data)
//     .then((res) => {
//         if(!res.ok) {
//             throw new Error('게시글을 찾을 수 없습니다');
//         }
//         return res.json();
//     })
//     .then((data) => {
//         console.log('fetch를 이용한 PATCH 함수입니다.')
//         console.log('성공');
//         console.log(data);
//     })
//     .catch((e) => {
//         console.log('fetch를 이용한 PATCH 함수입니다.')
//         console.log('Erorr');
//         console.log(e.message);
//     });


// // DELETE(articles) - 

// articles.deleteArticle(79)
//     .then((res) => {
//         if(!res.ok) {
//             throw new Error('게시글을 찾을 수 없습니다');
//         }
//         // return res.json()  // Unexpected end of JSON input 에러 발생
//     })
//     .then((data) => {
//         console.log('fetch를 이용한 DELETE 함수입니다.')
//         console.log('성공적으로 삭제 되었습니다');
//         console.log(data);
//     })
//     .catch((e) => {
//         console.log('fetch를 이용한 DELETE 함수입니다.')
//         console.log('Erorr');
//         console.log(e.message);
//     });


//----------------------------------------------------------------


// // GET List(product)

// try {
//     const params = {
//         page: null, 
//         pageSize: null, 
//         keyword: null,
//     };

//     const res = await product.getProductList(params);

//     console.log('axios를 이용한 GET_LIST 함수입니다.')
//     console.log('성공');
//     console.log(res);

// } catch(e) {
//     if (e.response) {
//         console.log('axios를 이용한 GET_LIST 함수입니다.')
//         console.log('Erorr');
//         console.log(e.response.status);
//         console.log(e.response.data);
//     } else {
//         console.log('axios를 이용한 GET_LIST 함수입니다.')
//         console.log('리퀘스트가 실패했습니다.');
//     }
// }


// // GET(product)

// try {
//     const res = await product.getProduct(33);

//     console.log('axios를 이용한 GET(id) 함수입니다.')

//     console.log('성공');
//     console.log(res);
// } catch(e) {
//     if(e.response) {
//         console.log('axios를 이용한 GET(id) 함수입니다.')
//         console.log('Erorr');
//         console.log(e.response.status);
//         console.log(e.response.data);
//     } else {
//         console.log('axios를 이용한 GET(id) 함수입니다.')
//         console.log('리퀘스트가 실패했습니다.');
//     }
// }


// // POST(product)

// try {
//     const product_data = {
//         name: null, // '문자열' 
//         description: null, // '문자열'
//         price: null, //숫자
//         tags: null, // ['문자열']'
//         images: null, // ['문자열']
//     };

//     const res = await product.createProduct(product_data);

//     console.log('axios를 이용한 POST 함수입니다.')
//     console.log('성공');
//     console.log(res);
// } catch(e) {
//     if(e.response) {
//         console.log('axios를 이용한 POST 함수입니다.')
//         console.log('유효성 검사 오류');
//         console.log(e.response.status);
//         console.log(e.response.data);
//     } else {
//         console.log('axios를 이용한 POST 함수입니다.')
//         console.log('리퀘스트가 실패했습니다.');
//     }
// }


// // PATCH(product)

// try {
//     const patch_data = {
//         name: null, // '문자열'
//         description: null, // '문자열'
//         price: null, //숫자
//         tags: null, // ['문자열']
//         images: null, // ['문자열']
//     };

//     const res = await product.patchProduct(33, patch_data);

//     console.log('axios를 이용한 PATCH 함수입니다.')
//     console.log('성공');
//     console.log(res);
// } catch(e) {
//     if(e.response) {
//         console.log('axios를 이용한 PATCH 함수입니다.')
//         console.log('Erorr');
//         console.log(e.response.status);
//         console.log(e.response.data);
//     } else {
//         console.log('axios를 이용한 PATCH 함수입니다.')
//         console.log('리퀘스트가 실패했습니다.');
//     }
// }

// // DELETE(product)

// try {
//     const res = await product.deleteProduct(33);

//     console.log('axios를 이용한 DELETE 함수입니다.')
//     console.log('성공적으로 삭제 되었습니다');
//     console.log(res);
// } catch(e) {
//     if(e.response) {
//         console.log('axios를 이용한 DELETE 함수입니다.')
//         console.log('Erorr');
//         console.log(e.response.status);
//         console.log(e.response.data)
//     } else {
//         console.log('axios를 이용한 DELETE 함수입니다.')
//         console.log('리퀘스트가 실패했습니다.');
//     }
// }