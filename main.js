import { getProductList } from './ProductService.js';

getProductList()
    .then(data => console.log('상품 목록:', data))
    .catch(error => console.error('상품 목록을 가져오는 중 에러 발생:', error));
