import * as article from './ArticleService.js';
import * as product from './ProductService.js';

const articleUploadData = {
  title: 'new title',
  content: 'new content',
  image: 'https://codeit.com/image.jpg',
};

const articleUpdateData = {
  title: 'string',
  content: 'string',
  image: 'string',
};

const productUploadData = {
  name: 'string',
  description: 'string',
  price: 12,
  manufacturer: 'string',
  tags: ['string'],
  images: ['string'],
};

const productUpdateData = {
  name: '보스헤드셋',
  description: 'string',
  price: 1,
  tags: ['ㅇㅇ'],
  images: ['ㅋㅋ'],
};

listArticleFunction();
getArticleFunction(85);
createArticleFunction(articleUploadData);
pathArticleFunction(117, articleUpdateData);
deleteArticleFunction(93);

listProductFunction(1, 10);
getProductFunction(5);
createProductFunction(productUploadData);
patchProductFunction(25, productUpdateData);
deleteProductFunction(99);

async function listArticleFunction(page, pageSize, keyword) {
  const articleList = await article.getArticleList({ page, pageSize, keyword });
}

async function getArticleFunction(articleId) {
  const articleGet = await article.getArticle(articleId);
}

async function createArticleFunction(articleUploadData) {
  const newArticle = await article.createArticle(articleUploadData);
}

async function pathArticleFunction(articleId, articleUpdateData) {
  const updatedArticle = await article.patchArticle(
    articleId,
    articleUpdateData
  );
}

async function deleteArticleFunction(articleId) {
  const deletedArticle = await article.deleteArticle(articleId);
}

async function listProductFunction(page, pageSize, keyword) {
  const productList = await product.getProductList({ page, pageSize, keyword });
  console.log(`Product List`, productList);
}

async function getProductFunction(productId) {
  const productGet = await product.getProduct(productId);
  console.log(`Get product with ID: ${productId}`, productGet);
}

async function createProductFunction(productUploadData) {
  const productCreate = await product.createProduct(productUploadData);
  console.log(`Created product: `, productCreate);
}

async function patchProductFunction(productId, productUpdateData) {
  const productPatch = await product.patchProduct(productId, productUpdateData);
  console.log(`Patched product with ID: ${productId}`, productPatch);
}

async function deleteProductFunction(productId) {
  const productDelete = await product.deleteProduct(productId);
  console.log(`Deleted product with ID: ${productId}`);
}
