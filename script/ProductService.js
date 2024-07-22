import axios from 'axios';

export function productErrorLog(error) {
  if (error.response) {
    console.log(error.response.status);
    console.log(error.response.data);
  } else {
    console.log('리퀘스트가 실패했습니다.');
  }
}

export async function getProductList(params = {}) {
  const res = await axios.get('https://sprint-mission-api.vercel.app/products', {
    params,
  });
  return res.data;
}

export async function getProduct(id) {
  const res = await axios.get(`https://sprint-mission-api.vercel.app/products/${id}`);
  return res.data;
}

export async function createProduct(productData) {
  const res = await axios.post('https://sprint-mission-api.vercel.app/products', productData);
  return res.data;
}

export async function patchProduct(id, productData) {
  const res = await axios.patch(`https://sprint-mission-api.vercel.app/products/${id}`, productData);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await axios.delete(`https://sprint-mission-api.vercel.app/products/${id}`);
  return res.data;
}
