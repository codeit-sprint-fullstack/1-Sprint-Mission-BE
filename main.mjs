import * as article from './api/articleService.mjs';
import * as product from './api/productService.mjs';

// - get all articles with parameters
// article.getArticleList({
//   page: 1,
//   pageSize: 1,
//   keyword: '기구',
// });

//-get all articles
// article.getArticleList();

// - get an article by id (if no id existed (404), it throws error)
// article.getArticle(11);

// - create new article
// article.createArticle('새 리뷰', '새리뷰입니다', '이미지주소');

//- update an article by id
// article.patchArticle(165, { title: '수정된 타이틀' });

//- delete the article by id
// article.deleteArticle(155);

//----------------------------//

// - get all products with parameters
// try {
//   const params = { page: 1, pageSize: 3, keyword: '갤럭시' };
//   const readAllProducts = await product.getProductList(params);
//   console.log(readAllProducts);
// } catch (err) {
//   console.error(err.message);

//   if (err.response) {
//     console.log(err.response.status);
//     console.log(err.response.data);
//   }
// }

// - get a product by id
// try {
//   const readProduct = await product.getProduct(4);
//   console.log(readProduct);
// } catch (err) {
//   console.error(err.message);
//   if (err.response) {
//     console.log(err.response.status);
//     console.log(err.response.data);
//   }
// }

// - create a product
// try {
//   const addProduct = await product.createProduct(
//     '머그컵',
//     '피카츄 머그컵',
//     2000,
//     ['키친웨어'],
//     ['이미지 주소']
//   );
//   console.log(addProduct);
// } catch (err) {
//   console.error(err.message);
//   if (err.response) {
//     console.log(err.response.status);
//     console.log(err.response.data);
//   }
// }

// - update a product by id
// try {
//   const updateProduct = await product.patchProduct(106, {
//     name: '수정됐다',
//   });
//   console.log(updateProduct);
// } catch (err) {
//   console.error(err.message);
//   if (err.response) {
//     console.log(err.response.status);
//     console.log(err.response.data);
//   }
// }

// - delete a product by id
// try {
//   const deleteProduct = await product.deleteProduct(108);
//   console.log(deleteProduct);
// } catch (err) {
//   console.error(err.message);
//   if (err.response) {
//     console.log(err.response.status);
//     console.log(err.response.data);
//   }
// }
