import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from './ArticleService.js';
import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from './ProductService.js';

getArticleList().then(data => console.log('게시글 목록:', data)).catch(error => console.error('게시글 목록을 가져오는 중 에러 발생:', error));

getArticle(1).then(data => console.log('게시글:', data)).catch(error => console.error('게시글을 가져오는 중 에러 발생:', error));

createArticle('새 게시글', '이것은 내용입니다', '이미지_주소').then(data => console.log('생성된 게시글:', data)).catch(error => console.error('게시글을 생성하는 중 에러 발생:', error));

patchArticle(1, '수정된 게시글', '수정된 내용', '수정된_이미지_주소').then(data => console.log('수정된 게시글:', data)).catch(error => console.error('게시글을 수정하는 중 에러 발생:', error));

deleteArticle(1).then(() => console.log('게시글이 삭제되었습니다.')).catch(error => console.error('게시글을 삭제하는 중 에러 발생:', error));

getProductList().then(data => console.log('상품 목록:', data)).catch(error => console.error('상품 목록을 가져오는 중 에러 발생:', error));

getProduct(1).then(data => console.log('상품:', data)).catch(error => console.error('상품을 가져오는 중 에러 발생:', error));

createProduct('새 상품', '이것은 새 상품입니다', 100, '제조사', ['태그1', '태그2'], ['이미지_주소']).then(data => console.log('생성된 상품:', data)).catch(error => console.error('상품을 생성하는 중 에러 발생:', error));

patchProduct(1, '수정된 상품', '수정된 설명', 200, ['태그1', '태그3'], ['수정된_이미지_주소']).then(data => console.log('수정된 상품:', data)).catch(error => console.error('상품을 수정하는 중 에러 발생:', error));

deleteProduct(1).then(() => console.log('상품이 삭제되었습니다.')).catch(error => console.error('상품을 삭제하는 중 에러 발생:', error));
