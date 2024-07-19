import axios from 'axios';

export async function getProductList(page, pageSize, keyword) {
    const URL = `https://sprint-mission-api.vercel.app/products?page=${page}&pageSize=${pageSize}&keyword=${keyword}`;
    try {
      const response = await axios.get(URL);
      const data = response.data;
      return console.log('상품 리스트를 가져왔습니다.',data);
    } catch (error) {
      console.error(`Error: ${error}`);
      throw error;
    }
  }