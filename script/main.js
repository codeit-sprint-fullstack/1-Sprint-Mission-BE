import { articleErrorLog, getArticle, createArticle, patchArticle, deleteArticle, getArticleList } from './ArticleService.js'
import { productErrorLog, getProductList, getProduct, createProduct, patchProduct, deleteProduct } from './ProductService.js'

// ArticleService.js 데이터 예시
const articleData = {
  title: "sprint4 test",
  content: "difficult, but I can do it",
  image: "image url",
};

// ProductService.js 데이터 예시
const productData = {
  name: '아이폰 11',
  description: '오래됨',
  price: 2222222,
  tags: [
    '전자 기기',
    '휴대폰',
  ],
  images: [
    'image url'
  ],
}

// ArticleService.js 함수 호출
try {
  const articleList = await getArticleList({ pages: 1, pageSize: 10, keyword: 'sprint4 test' });
  console.log(articleList);
} catch (error) {
  articleErrorLog(error);
}

try {
  const article = await getArticle(171);
  console.log(article);
} catch (error) {
  articleErrorLog(error);
}

try {
  const createdArticle = await createArticle(articleData);
  console.log(createdArticle);
} catch (error) {
  articleErrorLog(error);
}

try {
  const updatedArticle = await patchArticle(171, articleData);
  console.log(updatedArticle);
} catch (error) {
  articleErrorLog(error);
}

try {
  await deleteArticle(171);
  console.log('데이터 삭제 완료!');
} catch (error) {
  articleErrorLog(error);
}


// ProductService.js 함수 호출
try{
  const getProductList = await getProductList({page: 1, pageSize: 1, keyword: '아이폰'});
  console.log(getProductList);
} catch (error) {
  productErrorLog(error);
}

try{
  const getProduct = await getProduct(2);
  console.log(getProductList);
} catch (error) {
  productErrorLog(error);
}

try {
  const createProduct = await createProduct(productData);
  console.log(getProductList);
} catch (error) {
  productErrorLog(error);
}

try{
  const patchProduct = await patchProduct(48, productData);
  console.log(patchProduct);
} catch (error) {
  productErrorLog(error);
}

try {
  const deleteProduct = await deleteProduct(53);
  console.log('데이터 삭제 완료!');
} catch (error) {
  productErrorLog(error);
}