import axios from 'axios';

const productURL = axios.create({
  baseURL: 'https://sprint-mission-api.vercel.app',
});

export async function getProductList() {
  try {
    const productList = await productURL.get('/products');
    return productList;
  } catch (err) {
    console.log('Err: ' + err);
  }
}

export async function getProduct(id) {
  try {
    const product = await productURL.get(`/products/${id}`);
    if (!product) {
      throw new Error(err);
    }
    return product.data;
  } catch (err) {
    console.log('상품을 찾을 수 없음, Err: ' + err);
  }
}

export async function createProduct(data) {
  try {
    const productPost = await productURL.post('/products123123', data);
    console.log(productPost.data);
    console.log(productPost);
    return productPost;
  } catch (err) {
    console.log('유효성 검사 오류, Err: ' + err);
  }
}

export async function patchProduct(id, data) {
  try {
    const productPatch = await productURL.patch(`/products/${id}`, data);
    return productPatch;
  } catch (err) {
    console.log('상품을 찾을 수 없음, Err: ' + err.response.data.message);
  }
}

export async function deleteProduct(id) {
  try {
    const productDelete = await productURL.delete(`/products/${id}`);
    console.log(productDelete);
    return productDelete;
  } catch (err) {
    console.log('상품을 찾을 수 없음, Err: ' + err.response.data.message);
  }
}