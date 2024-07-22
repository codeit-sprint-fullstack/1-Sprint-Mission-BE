// Importing Api Services
import * as ProductService from './services/ProductService.js';
import * as ArticleService from './services/ArticleService.js';

ArticleService.getArticleList('test');
ArticleService.getArticle(138);
ArticleService.postArticle('anything', 'New Post Content', 'String');
ArticleService.patchArticle(137, {title:'바꿈', content: 'Good' });
ArticleService.deleteArticle(138);

ProductService.getProductList( '상품');
ProductService.getProduct(89);
ProductService.postProduct('초콜릿', '두바이 초콜릿', 100000, ['초콜릿', '간식'], ['url']);
ProductService.patchProduct(89, { price: 111111});
ProductService.deleteProduct(89);