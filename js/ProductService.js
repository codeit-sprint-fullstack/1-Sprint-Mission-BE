import axios from "axios";

const PRODUCT_API_ADDRESS = "https://sprint-mission-api.vercel.app";

const instance = axios.create({
  baseURL: PRODUCT_API_ADDRESS,
  header: { "Content-Type": "application/json" },
});

/* getProductList : 상품 목록 조회 */
/* ===== REQUEST ===== 
origin : https://sprint-mission-api.vercel.app
path : /products
method : GET
param : {
    page : / optional / default : 1 / type : integer / description : pageSize 크기로 나눠진 list의 page 번호
    pageSize : / opsional / default : 100 / type : integer / description : 배열로 보내줄 list의 최대 크기
    keyword : / optional / default : (none) / type : string / description : list 중 keyword값이 name이나 decription의 값이 포함된 상품만 선별
}
header : default
body : none
*/
/* ===== RESPONSE(data) =====
[
    {
        "id": 25,
        "name": "deadpool toy",
        "description": "marble hot toy",
        "price": 170000,
        "manufacturer": "string",
        "tags": [
        "hot toy"
        ],
        "images": [
        "https://telegra.ph/file/82c23f75c246cb8a78333.png"
        ],
        "favoriteCount": 0
    }
]
*/
export async function getProductList(page = 1, pageSize = 100, keyword = "") {
  try {
    const params = {
      page: page,
      pageSize: pageSize,
      keyword: keyword,
    };

    const res = instance.get("/products", { params });

    return (await res).data;
  } catch (err) {
    if (err.response) {
      // status = 2xx 이외 처리
      console.log("getProductList - status : " + err.response.status);

      return err.response.data;
    } else if (err.request) {
      // request 완료 & response 안됨
      console.log("getProductList - no response");

      return err.request;
    } else {
      // request 설정 오류
      console.log("getProductList - request setting error");

      return null;
    }
  }
}

/* getProduct : 상품 상세 조회 */
/* ===== REQUEST ===== 
origin : https://sprint-mission-api.vercel.app
path : /products/{id}
method : GET
param : (none)
header : (default)
body : (none)
*/
/* ===== RESPONSE(data) =====
{
    "id": 2,
    "name": "퀸사이즈 침대",
    "description": "퀸사이즈 침대 프레임",
    "price": 500000,
    "manufacturer": "",
    "tags": [
        "가구",
        "침대",
        "퀸사이즈"
    ],
    "images": [
        "https://images-na.ssl-images-amazon.com/images/I/71aG%2BxDKSYL._AC_SL1500_.jpg"
    ],
    "favoriteCount": 6
}
*/
export async function getProduct(id) {
  try {
    const res = instance.get(`/products/${id}`);

    return (await res).data;
  } catch (err) {
    if (err.response) {
      // status = 2xx 이외 처리
      if (err.response.status === 404) {
        console.log("상품을 찾을 수 없음 getProduct - status : 404");
      } else {
        console.log("getProduct - status : " + err.response.status);
      }

      return err.response.data;
    } else if (err.request) {
      // request 완료 & response 안됨
      console.log("getProduct - no response");

      return err.request;
    } else {
      // request 설정 오류
      console.log("getProduct - request setting error");

      return null;
    }
  }
}

/* createProduct : 상품 등록 */
/* ===== REQUEST ===== 
origin : https://sprint-mission-api.vercel.app
path : /products
method : POST
param : (none)
header : (default)
body :{
    name : / required / type : string / description : 상품명
    description : / required / type : string / description : 상품 설명
    price : / required / type : integer / description : 상품 가격
    manufacturer : / required / type : string / description : 상품 공정
    tags : / required / type : string array / description : 상품 태그 / !!배열 크기 제한 확인 필요
    images : / required / type : string array / description : 상품 이미지 / !!배열 크기 제한 확인 필요
}
*/
/* ===== RESPONSE(data) =====
{
    "id": 39,
    "name": "wolverene",
    "description": "marvel hot toy",
    "price": 180000,
    "manufacturer": "marvel",
    "tags": [
        "X-MAN",
        "wolverene",
        "Logan"
    ],
    "images": [
        "https://telegra.ph/file/58226d9dd211ecb20c665.jpg"
    ],
    "favoriteCount": 0
}    
*/
export async function createProduct(
  name,
  description,
  price,
  manufacturer,
  tags,
  images
) {
  try {
    const body = {
      name: name,
      description: description,
      price: price,
      manufacturer: manufacturer,
      tags: tags,
      images: images,
    };

    const res = instance.post("/products", body);

    return (await res).data;
  } catch (err) {
    if (err.response) {
      // status = 2xx 이외 처리
      if (err.response.status === 400) {
        console.log("유효성 검사 오류 createProduct - status : 400");
      } else {
        console.log("createProduct - status : " + err.response.status);
      }

      return err.response.data;
    } else if (err.request) {
      // request 완료 & response 안됨
      console.log("createProduct - no response");

      return err.request;
    } else {
      // request 설정 오류
      console.log("createProduct - request setting error");

      return null;
    }
  }
}

/* patchProduct : 상품 수정 */
/* ===== REQUEST ===== 
origin : https://sprint-mission-api.vercel.app
path : /products/{id}
method : PATCH
param : (none)
header : (default)
body : {
    name : / optional / type : string / description : 상품명
    description : / optional / type : string / description : 상품 설명
    price : / optional / type : integer / description : 상품 가격
    manufacturer : / optional / type : string / description : 상품 공정
    tags : / optional / type : string array / description : 상품 태그 / !!배열 크기 제한 확인 필요
    images : / optional / type : string array / description : 상품 이미지 / !!배열 크기 제한 확인 필요
}
*/
/* ===== RESPONSE(data) =====
{
    "id": 12,
    "name": "wolverene ver5",
    "description": "marvel hot toy",
    "price": 480000,
    "manufacturer": "MARVEL2",
    "tags": [
        "X-MAN",
        "wolverene",
        "Logan"
    ],
    "images": [
        "https://telegra.ph/file/58226d9dd211ecb20c665.jpg"
    ],
    "favoriteCount": 0
}
*/
export async function patchProduct(id, body) {
  try {
    const res = instance.patch(`/products/${id}`, body);

    return (await res).data;
  } catch (err) {
    if (err.response) {
      // status = 2xx 이외 처리
      if (err.response.status === 404) {
        console.log("상품을 찾을 수 없음 patchProduct - status : 404");
      } else {
        console.log("patchProduct - status : " + err.response.status);
      }

      return err.response.data;
    } else if (err.request) {
      // request 완료 & response 안됨
      console.log("patchProduct - no response");

      return err.request;
    } else {
      // request 설정 오류
      console.log("patchProduct - request setting error");

      return null;
    }
  }
}

/* deleteProduct : 상품 삭제 */
/* ===== REQUEST ===== 
origin : https://sprint-mission-api.vercel.app
path : /products/{id}
method : DELETE
param : (none)
header : (default)
body : (none)
*/
/* ===== RESPONSE(data) =====
(none)
*/
export async function deleteProduct(id) {
  try {
    const res = instance.delete(`/products/${id}`);

    return (await res).data;
  } catch (err) {
    if (err.response) {
      // status = 2xx 이외 처리
      if (err.response.status === 404) {
        console.log("상품을 찾을 수 없음 deleteProduct - status : 404");
      } else {
        console.log("deleteProduct - status : " + err.response.status);
      }

      return err.response.data;
    } else if (err.request) {
      // request 완료 & response 안됨
      console.log("deleteProduct - no response");

      return err.request;
    } else {
      // request 설정 오류
      console.log("deleteProduct - request setting error");

      return null;
    }
  }
}

// for patch param info
export function getPatchBodyFrame() {
  return {
    name: "optional",
    description: "optional",
    price: "optional",
    manufacturer: "optional",
    tags: "optional",
    images: "optional",
  };
}
