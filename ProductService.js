import axios from "axios";



export async function addProducts(name, description, price, tags, images) { //파라미터로 받아서 입력 예정
  try {
    const postRes = await axios.post('http://sprint-mission-api.vercel.app/products',{name, description, price, tags, images});
    console.log(postRes.data)
  } catch (error) {
    console.error("Error posting product:", error);
  }
}


export async function getProducts(article_id){
  try{
    const getRes = await axios.get(`http://sprint-mission-api.vercel.app/products/${article_id}`)
    console.log(getRes.data)
    

  }
  catch(e){
    console.log(e)
  }
  
}
export async function  getProductsList(page = 1 ,pageSize = 100,keyword){
  const getRes_id = await axios.get(`http://sprint-mission-api.vercel.app/products`)
  const data = getRes_id.data
  if(keyword){
    const filterProducts = data.filter(proudct =>
      proudct.name.includes(keyword) ||
      proudct.description.includes(keyword)
      );
      console.log(filterProducts)
      return filterProducts
  }
  
  return filterProducts
  
}

export async function updateProducts(Products_id,data){
  try{
    
    const patchRes = await axios.patch(`http://sprint-mission-api.vercel.app/products/${Products_id}`,data);
    // console.log(patchRes.data)
    return patchRes.data
  } catch(e){
    console.log(e)
  }
}

export async function deleteProducts(Products_id){
  try{
    const deleteRes = await axios.delete(`http://sprint-mission-api.vercel.app/products/${Products_id}`)
  // console.log(deleteRes.data)

  }
  catch(e){
    console.log(e)
  }
  
}

// addProducts("11111111111", "2222222222", 44, ["tag1", "tag2"], ["img1.png", "img2.png"]);
// getProductsList(1,100,"머그컵");
// deleteProducts(12)
// getProducts(3) 
// updateProducts(32,{name:"3",price:369369}) 
