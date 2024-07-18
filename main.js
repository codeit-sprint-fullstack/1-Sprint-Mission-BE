import { createProduct } from './ProductService.js';

createProduct('고디바 초콜릿', '이것은 고디바입니다', 50000, '고디바', ['초콜릿', '달달'], ['이미지_주소'])
    .then(data => console.log('생성된 상품:', data))
    .catch(error => console.error('상품을 생성하는 중 에러 발생:', error));
