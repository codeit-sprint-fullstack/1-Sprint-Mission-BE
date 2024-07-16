import axios from "axios";

const instance = axios.create({
  baseURL: 'https://sprint-mission-api.vercel.app',
});

export async function getProductList({page = 1, pageSize = 10, keyword = ''} = {}){
  const params = {
    page,
    pageSize,
    keyword,
  };
  try{
    const res = await instance.get('/products', { params });
    console.log(res.data);
  } catch(error) {
    if(error.response){
      console.log(error.response.status);
      console.log(error.response.data);
    }
    else console.log('리퀘스트가 실패했습니다.');
  }
}

export async function getProduct(id){
  try{
    const res = await instance.get(`/products/${id}`);
    console.log(res.data);
  } catch(error) {
    if(error.response){
      console.log(error.response.status);
      console.log(error.response.data);
    }
    else console.log('리퀘스트가 실패했습니다.');
  }
}

export async function createProduct(productContent){
  try{
    const res = await instance.post('/products', productContent);
    console.log(res.data);
  } catch(error) {
    if(error.response){
      console.log(error.response.status);
      console.log(error.response.data);
    }
    else console.log('리퀘스트가 실패했습니다.');
  }
}

export async function patchProduct(id, updateContent){
  try{
    const res = await instance.patch(`/products/${id}`, updateContent);
    console.log(res.data);
  } catch(error) {
    if(error.response){
      console.log(error.response.status);
      console.log(error.response.data);
    }
    else console.log('리퀘스트가 실패했습니다.');
  }
}

export async function deleteProduct(id){
  try{
    const res = await instance.delete(`/products/${id}`);
    // console.log(res.data);
  } catch(error) {
    if(error.response){
      console.log(error.response.status);
      console.log(error.response.data);
    }
    else console.log('리퀘스트가 실패했습니다.');
  }
}