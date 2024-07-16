import axios from "axios";

const PRODUCT_API_ADDRESS = "https://sprint-mission-api.vercel.app";
// const PRODUCT_API_ADDRESS = "https://corsproxy.io/?" + encodeURIComponent('https://sprint-mission-api.vercel.app');
/*
[ ]  axios를 이용해 주세요.
[ ]  async/await 을 이용하여 비동기 처리를 해주세요.
[ ]  try/catch 를 이용하여 오류 처리를 해주세요.https://sprint-mission-api.vercel.app/products?page=1&pageSize=5&keyword=toy
*/

const instance = axios.create({
    baseURL : PRODUCT_API_ADDRESS,
    header : {'Content-Type': 'application/json'}
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
export async function getProductList(page = 1, pageSize = 100, keyword = "")
{
    const params = { 
        "page" : page,
        "pageSize" : pageSize,
        "keyword" : keyword,
    };
    
    const res = await instance.get("/products", {params});
    
    return (await res);
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
export async function getProduct(id)
{
    const res = instance.get(`/products/${id}`);
    
    return (await res).data;    
}

/* createProduct : 상품 등록 */
/* ===== REQUEST ===== 
origin : https://sprint-mission-api.vercel.app
path : /products
method : POST
param : (none)
header : (default)
body : {
    name : / required / type : string / description : 상품명
    description : / required / type : string / description : 상품 설명
    price : / required / type : integer / description : 상품 가격
    manufacturer : / required / type : string / description : 상품 공정
    tags : / required / type : string array / description : 상품 태그 / !!배열 크기 제한 확인 필요
    images : / required / type : string array / description : 상품 이미지 / !!배열 크기 제한 확인 필요
} / structure : json
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
export async function createProduct(name, description, price, manufacturer, tags, images)
{    
    const body = {
        "name" : name,
        "description" : description,
        "price" : price,
        "manufacturer" : manufacturer,
        "tags" : tags,
        "images" : images,
    };

    const res = instance.post("/products", body);  

    return (await res).data;
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
} / structure : json
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
// export async function patchProduct(id, name, description, price, manufacturer, tags, images)
export async function patchProduct(id, body)
{
    const res = instance.patch(`/products/${id}`, body);
    
    return (await res).data;
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
export async function deleteProduct(id)
{
    const res = instance.delete(`/products/${id}`);
    
    return (await res).data;
}

// for patch param info
export function getPatchBodyFrame()
{
    return {
        "name" : "optional",
        "description" : "optional",
        "price" : "optional",
        "manufacturer" : "optional",
        "tags" : "optional",
        "images" : "optional"
    };
}