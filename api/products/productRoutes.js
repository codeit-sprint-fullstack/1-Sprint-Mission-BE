import express, { Router } from 'express';
import Product from '../../models/Product.js';

const router = express.Router(); 

// 상품 목록 조회
router.get('/', async (req, res) => {
    const { sort = 'recent', offset = 0, limit = 10, search = '' } = req.query;

    try {
      // 정렬 옵션 설정
      const sortOption = sort === 'recent' ? { createdAt: -1 } : {}; // 1은 오름차순, -1 내림차순

      // 검색 조건 설정
      const searchQuery = {
        $or: [ // 두 가지 조건 중 하나라도 만족하는 문서를 찾도록 설정
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
        // regex : name 또는 description 필드에서 search 문자열을 찾음
        // 'i': 대소문자 구분 없이 검색하도록 설정
    };

      // 페이지네이션 및 검색 적용
      const products = await Product.find(searchQuery) // 조건에 맞는 문서 조회
                                    .sort(sortOption) // 정렬함
                                    .skip(Number(offset)) // offset만큼 문서 건너뜀
                                    .limit(Number(limit)) // 최대 limit 만큼 문서 반환
                                    .select('id name price createdAt'); //선택한 필드만 포함된 결과를 반환
      res.status(200).send(products);
    } catch (error) {
      console.error('상품 목록 조회 중 오류 발생:', error);
      res.status(500).send({ error: '상품 목록을 불러오는 데 실패했습니다' });
    }
});

// 상품 상세 조회
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
        return res.status(404).send({ message: '상품을 찾을 수 없습니다.' });
        }
        res.status(200).send(product);
    } catch (error) {
    console.error('상품 상세 조회 중 오류 발생:', error);
    res.status(500).send({ error: '상품을 불러오는 데 실패했습니다' });
}
});

// 상품 등록
router.post('/', async (req, res) => {
    const { name, description, price, tags } = req.body;

    // 데이터 검증
    if (!name || !description || !price) {
    return res.status(400).send({ error: '상품 이름과 설명, 판매가격은 필수로 적어주세요.' });
    }

    try {
    const newProduct = new Product({
        name,
        description,
        price: Number(price), // price를 숫자로 변환하여 저장
        tags,
    });

    await newProduct.save();
    res.status(201).send(newProduct);
    } catch (error) {
    res.status(500).send({ error: error.message });
    }
});

// 상품 수정 API
router.patch('/:id', async (req, res) => {
const { id } = req.params;

try {
    // 상품을 찾고 업데이트
    const product = await Product.findByIdAndUpdate(id, req.body, 
    {
    new: true, 
    runValidators: true, // 유효성 검사
    });

    if (!product) {
    return res.status(404).send({ message: '상품을 찾을 수 없습니다.' });
    }

    res.status(200).send(product);
} catch (error) {
    console.error('상품 수정 중 오류 발생:', error);
    res.status(500).send({ error: '상품을 수정하는 데 실패했습니다' });
}
});

// 상품 삭제 API
router.delete('/:id', async (req, res) => {
const { id } = req.params; // 수정된 부분: ID를 문자열로 사용

try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
    return res.status(404).send({ message: '상품을 찾을 수 없습니다.' });
    }

    res.status(200).send({ message: '상품이 성공적으로 삭제되었습니다.' });
} catch (error) {
    console.error('상품 삭제 중 오류 발생:', error);
    res.status(500).send({ error: '상품을 삭제하는 데 실패했습니다' });
}
});

export default router;