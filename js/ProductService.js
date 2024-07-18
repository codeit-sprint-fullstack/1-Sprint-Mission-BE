// Product API
// getProductList() : GET 메서드를 사용해 주세요. : page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
// getProduct() : GET 메서드를 사용해 주세요.
// createProduct() : POST 메서드를 사용해 주세요. : request body에 name, description, price, tags, images 를 포함해 주세요.
// patchProduct() : PATCH 메서드를 사용해 주세요.
// deleteProduct() : DELETE 메서드를 사용해 주세요.
//  axios를 이용해 주세요.
//  async/await 을 이용하여 비동기 처리를 해주세요.
//  try/catch 를 이용하여 오류 처리를 해주세요.

import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://sprint-mission-api.vercel.app/products',
});

export async function getProductList(page, pageSize, keyword) {
  try {
    if (!keyword) {
      var res = await instance.get(`?page=${page}&pageSize=${pageSize}`);
    } else {
      var res = await instance.get(`?page=${page}&pageSize=${pageSize}&keyword=${keyword}`);
    }
    return res.data;
  } catch (e) {
    console.log(e.name + ':' + e.message);
  }
}

export async function getProduct(id) {
  try {
    if (!id) {
      var res = await instance.get(``);
    } else {
      var res = await instance.get(`/${id}`);
    }
    return res.data;
  } catch (e) {
    console.log(e.name + ':' + e.message);
  }
  
}

export async function createProduct(requestBody) {
  try {
    await instance.post('', requestBody);
    alert('저장되었습니다.');
    location.reload(true);
  } catch (e) {
    console.log(e.name + ':' + e.message);
  }
}

export async function patchProduct(id,requestBody) {
  try {
    await instance.patch(`/${id}`,requestBody);
    alert('수정되었습니다.');
    location.reload(true);
  } catch (e) {
    console.log(e.name + ':' + e.message);
  }
}

export async function deleteProduct(id) {
  try {
    await instance.delete(`/${id}`);
    alert('삭제되었습니다.');
    location.reload(true);
  } catch (e) {
    console.log(e.name + ':' + e.message);
  }
}

