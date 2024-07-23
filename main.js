import * as article from './ArticleService.js';
import * as product from './ProductService.js';

const test = document.querySelector('.test');

const articleData = {
  title: '1112',
  content: '1112',
  image: 'string',
};

//article.getArticleList();
//article.getArticle(10);
//article.createArticle()
//article.patchArticle()
//article.deleteArticle()

const productData = {
  name: 'new',
  description: 'new',
  price: 100000,
  tags: ['new'],
  images: ['new.jpg'],
};

//product.getProductList();
const test1 = await product.getProduct(17);
//product.createProduct();
//product.patchProduct();
//product.deleteProduct();

console.log(test1);

test.innerHTML = test1.name;
