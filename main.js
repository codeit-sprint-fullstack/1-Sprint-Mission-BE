import { patchProduct } from './ProductService.js';

patchProduct(85, '나쵸', '고디바에서 나쵸로 변경되었습니다.', 2000, ['과자', '치'], ['수정된_이미지_주소'])
    .then(data => console.log('수정된 상품:', data))
    .catch(error => console.error('상품을 수정하는 중 에러 발생:', error));
