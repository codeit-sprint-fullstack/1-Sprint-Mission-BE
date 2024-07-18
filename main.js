import { deleteProduct } from './ProductService.js';

deleteProduct(85)
    .then(() => console.log('상품이 삭제되었습니다.'))
    .catch(error => console.error('상품을 삭제하는 중 에러 발생:', error));
