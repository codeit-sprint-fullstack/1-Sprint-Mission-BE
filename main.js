import { getProduct } from './ProductService.js';

getProduct(4)
    .then(data => console.log('상품:', data))
    .catch(error => console.error('상품을 가져오는 중 에러 발생:', error));
