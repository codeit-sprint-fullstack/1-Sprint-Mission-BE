import { getProduct, getProductList, createProduct, patchProduct, deleteProduct } from './ProductService.js'

/* getProductList 테스트 */
// console.log('GET /products');
// const data = await getProductList({ page:1, pageSize:222, keyword:'삼성' });
// console.log(data);


/* getProduct 테스트 */
// try {
// console.log('GET /products/:id');
// const product = await getProduct(2);
// console.log(product);
// console.log('성공');
// } catch {
//   console.log('상품을 찾을 수 없음')
// }


/* createProduct 테스트 */
// console.log('POST /products');
// const productData = {
//   name: "z플립6",
//   description: "삼성 갤럭시 z플립",
//   price: 600000,
//   manufacturer: "삼성전자",
//   tags: ["전자제품", "스마트폰", "삼성"],
//   images: ["https://images.samsung.com/kdp/goods/2024/07/09/6e7aff2a-f53a-4650-98dd-35e0e8a88326.png"]
// }
// try {
// const newProductData = await createProduct(productData);
// console.log(newProductData);
// console.log('성공');
// } catch {
//   console.log('유효성 검사 오류')
// }


/* patchProduct 테스트 */
// console.log('PATCH /products/:id');
// const patchData = {
//   name: "z플립4",
//   description: "삼성 갤럭시 z플립",
//   price: 400000,
//   manufacturer: "삼성전자",
//   tags: ["전자제품", "스마트폰", "삼성"],
//   images: ["https://images.samsung.com/kdp/goods/2022/10/24/1f42bfed-31e4-4e05-8756-3afb0abd723e.png?$PD_GALLERY_L_PNG$"]
// }
// try {
// const patch = await patchProduct(71, patchData)
// console.log('성공')
// } catch  {
//   console.log('상품을 찾을 수 없음');
// }


/* deleteProduct 테스트 */
// try{
// console.log('DELEAE /products/:id');
// const deleteProductList = await deleteProduct(71);
// console.log(deleteProductList);
// console.log('성공적으로 삭제됨')
// } catch {
//   console.log('상품을 찾을 수 없음')
// }


import { getArticle, getArticleList, createArticle, patchArticle, deleteArticle } from './ArticleService.js'
/* getArticleList 테스트 */
// getArticleList({ page:1, pageSize:123, keyword: '국내산'})


/* getArticle 테스트 */
// getArticle(41);


/* createArticle 테스트 */
// const articleData = {
//   "title": "string",
//   "content": "string",
//   "image": "string"
// };
// createArticle(articleData)


/* parchArticle 테스트 */
// const patchData = {
//   "title": "string",
//   "content": "string",
//   "image": "string"
// };
// patchArticle(45, patchData)


/* deleteArticle 테스트 */
// deleteArticle(146)