import axios from 'axios';

const BASE_URL = 'https://panda-market-api.vercel.app/products';

export async function getProductList({
  order = 'createdAt',
  cursor = null,
  limit = 3,
} = {}) {
try {
  const query = new URLSearchParams({
    order,
    limit,
    cursor: cursor || ''
  }).toString();
  const response = await axios.get(`${BASE_URL}?${query}`);
  const body = response.data;
  console.log('API 응답 데이터:', body);
  return body;
} catch (error) {
  throw new Error('상품을 불러오는데 실패했습니다');
}
}