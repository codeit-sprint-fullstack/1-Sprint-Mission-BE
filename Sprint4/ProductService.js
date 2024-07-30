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

export async function getProduct(id) {
    const URL = `https://sprint-mission-api.vercel.app/products/${id}`;
    try {
        const response = await axios.get(URL);
        const data = response.data;
        return console.log('상품 정보를 가져왔습니다.',data);
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export async function createProduct(product) {
    const URL = 'https://sprint-mission-api.vercel.app/products';

    try {
      const response = await axios.post(URL,
        {
        name: product.name,
        description: product.description,
        price: product.price,
        tags: product.tags,
        images: product.images
        }
      );
      const data = response.data;
      return console.log('새로운 상품이 추가되었습니다.', data);
    } catch (error) {
      console.error(`Error : ${error}`);
      throw error;
    }
  }

export async function patchProduct(id, Product) {
    const URL = `https://sprint-mission-api.vercel.app/products/${id}`;
  
    try {
      const response = await axios.patch(URL, Product);
      const data = response.data;
      return console.log('상품 업데이트가 완료되었습니다.',data);
    } catch (error) {
      console.error(`Error : ${error}`);
      throw error;
    }
}

export async function deleteProduct(id) {
    const URL = `https://sprint-mission-api.vercel.app/products/${id}`;
  
    try {
      const response = await axios.delete(URL);
      const data = response.data;
      return console.log('삭제가 완료되았습니다.',data);
    } catch (error) {
      console.error(`Error : ${error}`);
      throw error;
    }
  }