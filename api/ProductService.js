import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://sprint-mission-api.vercel.app',
  timeout: 3000,
})


export async function getProductList(params = {}) {
  const response = await instance.get('/products', { 
    params 
  });
  return response.data;
}


export async function getProduct(id) {
  const response = await instance.get(`/products/${id}`); 
  return response.data;
}


export async function createProduct(productData) {
  const response = await instance.post('/products', productData);
  return response.data;
}


export async function patchProduct(id, patchProduct) {
  const response = await instance.patch(`/products/${id}`, patchProduct);
  return response.data;
}


export async function deleteProduct(id) {
  const response = await instance.delete(`/products/${id}`);
  return response.data;
} 