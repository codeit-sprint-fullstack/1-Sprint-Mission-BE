import axios from "axios";

const instance = axios.create({
  baseURL: 'https://sprint-mission-api.vercel.app',
  timeout: 3000,
});

export async function getProductList(options = {}) {
  const {page=1, pageSize=100, keyword} = options;
  const params = {
    page: page,
    pageSize: pageSize,
    keyword: keyword || undefined,
  }

  const res = await instance.get('/products', { params });
  return res.data;
}

export async function getProduct(id) {
  const res = await instance.get(`/products/${id}`);
  return res.data;
}

export async function createProduct(productData) {
  const res = await instance.post('/products', productData);
  return res.data;
}