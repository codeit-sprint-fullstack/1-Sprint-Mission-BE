import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://sprint-mission-api.vercel.app',
  headers: { 'Content-Type': 'application/json' },
});

export async function getProductList(params = {}) {
  try {
    const res = await instance.get('/products', { params });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getProduct(id) {
  try {
    const res = await instance.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createProduct({
  name,
  description,
  price,
  tags,
  images,
}) {
  const newProduct = {
    name,
    description,
    price,
    tags,
    images,
  };
  try {
    const res = await instance.post('/products', newProduct);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function patchProduct(id, amendData) {
  try {
    const res = await instance.patch(`/products/${id}`, amendData);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    const res = await instance.delete(`/products/${id}`);
    return {
      status: res.status,
      message: 'The product has deleted successfully',
    };
  } catch (error) {
    throw error;
  }
}
