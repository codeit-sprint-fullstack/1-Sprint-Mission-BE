import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from './ArticleService.js';
import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from './ProductService.js';

getArticleList({ page: 1, pageSize: 10, keyword: 'test' });

getArticle(81);

const articleData = {
  title: 'title',
  content: 'content',
  image: 'image',
}

createArticle(articleData);

patchArticle(199, articleData);

deleteArticle(170);

getProductList({ page: 1, pageSize: 10, keyword: 'test' });

getProduct(80);

const productData = {
  name: 'name',
  description: 'description',
  price: 1000,
  tags: 'tags',
  image: 'image',
};

createProduct(productData);

patchProduct(121, productData);

deleteProduct(99);