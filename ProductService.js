import axios from "axios";

const instance = axios.create({
  baseURL: 'https://sprint-mission-api.vercel.app/products',
});

export async function getArticleList({page = 1, pageSize = 10, keyword = ''} = {}){
  const params = {
    page,
    pageSize,
    keyword,
  };
  try{
    const res = await instance.get('', { params });
    console.log(res.data);
  } catch(error) {
    if(error.response){
      console.log(error.response.status);
      console.log(error.response.data);
    }
    else console.log('리퀘스트가 실패했습니다.');
  }
}