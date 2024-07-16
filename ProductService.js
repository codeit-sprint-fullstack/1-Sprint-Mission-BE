import axios from "axios";

export const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const Products_config = {
  "name" : "string",
  "description" : "string",
  "price" : 0,
  "manufacturer" : "string",
  "tags" : ["string"],
  "images" : ["string"]
};


export async function addProducts() { //파라미터로 받아서 입력 예정
  try {
    // Products_config.name = "단 하나밖에 없는 상품";
    // Products_config.description = "Test";
    // Products_config.price = 99;
    // Products_config.manufacturer = "Test";
    // Products_config.tags = ["tag1", "tag2"];
    // Products_config.images = ["img1.png", "img2.png"];
    delete Products_config.manufacturer;

    const postRes = await axios.post('http://sprint-mission-api.vercel.app/products', Products_config, config);
    console.log(postRes.data)
  } catch (error) {
    console.error("Error posting product:", error.response ? error.response.data : error.message);
  }
}


export async function getProductsList() {
  const getRes = await axios.get('http://sprint-mission-api.vercel.app/products')
  // console.log(getRes.data)
    .then((res) => {
      console.log(res.data)
    })
}
export async function  getProducts(Products_id){
  const getRes_id = await axios.get(`http://sprint-mission-api.vercel.app/products/${Products_id}`)
  // console.log(getRes_id.data)
  return getRes_id.data
  
}

export async function updateProducts(Products_id){
  try{
    
    const data = await getProducts(Products_id); // 불러오고
    // 매핑 매핑 하는이유 : 객체를 전달하기엔 출력내용이 "name" : "string", -> name : "string " 이런식으로 나와서 조건을 맞춰줘야하기때문
    Products_config.name = data.name
    Products_config.description = data.description
    Products_config.price = data.price
    Products_config.manufacturer = data.manufacturer
    Products_config.tags = data.tags
    Products_config.images = data.images
    
    // 변경 내용 수정
    Products_config.price = 10000000
    const patchRes = await axios.patch(`http://sprint-mission-api.vercel.app/products/${Products_id}`,Products_config);
    // console.log(patchRes.data)
    return patchRes.data
  } catch(e){
    console.log(e)
  }
}

export async function deleteProducts(Products_id){
  const deleteRes = await axios.delete(`http://sprint-mission-api.vercel.app/products/${Products_id}`)
  // console.log(deleteRes.data)
}

// addProducts();
getProductsList();
// id 번호 파라미터로 넣어줘야함
// deleteProducts(12)
// getProducts(44) 
// updateProducts(12) 
