import axios from "axios";

const apiUrl = "https://sprint-mission-api.vercel.app/products";
const headers = {
  "Content-Type": "application/json",
};

/** 제품 목록 조회 함수
 * @param {number} page 몇번째 페이지로 할것이냐?
 * @param {number} pageSize 한페이지에 몇개나 나오게 할것이냐? [이거 따라서 페이지가 정해짐]
 * @param {string} keyword 키워드
 */
export async function getProductList(page, pageSize, keyword) {
  try {
    const url = `${apiUrl}?page=${page || 1}&pageSize=${
      pageSize || 100
    }&keyword=${keyword || ""}`;

    const response = await fetch(url, {
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`200번대 안나옴: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("뭔가 문제있음:", error.message);
    throw error;
  }
}

/** 제품 개별 조회 함수
 * @param {number} ID 제품의 ID를 넣자
 */
export async function getProduct(ID) {
  const apiUrl = `https://sprint-mission-api.vercel.app/products/${ID || 2}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.error("뭔가 안됐음:", error);
  }
}

/** 제품 등록 함수
 * @param {string} name 등록 제품의 이름을 넣자
 * @param {string} description 등록 제품의 설명을 넣자
 * @param {number} price 등록 제품의 가격을 넣자
 * @param {string} manufacturer 제조사를 넣자
 * @param {Array} tags 배열형태로 태그 전달하자
 * @param {Array} images 배열형태로 이미지를 전달하자
 */
export function createProduct(
  name,
  description,
  price,
  manufacturer,
  tags,
  images
) {
  axios
    .post(apiUrl, {
      name: name,
      description: description,
      price: price,
      manufacturer: manufacturer,
      tags: tags,
      images: images,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}

/** 제품 수정 함수
 * @param {number} ID 제품의 ID를 넣자
 * @param {string} name 등록 제품의 이름을 넣자
 * @param {string} description 등록 제품의 설명을 넣자
 * @param {number} price 등록 제품의 가격을 넣자
 * @param {string} manufacturer 제조자를 넣자
 * @param {Array} tags 태그를 배열로 넣자
 * @param {Array} images 이미지 주소를 배열로 넣자
 */
export function patchProduct(
  ID,
  name,
  description,
  price,
  manufacturer,
  tags,
  images
) {
  const apiUrl = `https://sprint-mission-api.vercel.app/products/${ID || null}`;
  axios
    .patch(apiUrl, {
      name: name,
      description: description,
      price: price,
      manufacturer: manufacturer,
      tags: tags,
      images: images,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}

/** 제품 삭제 함수
 * @param {number} ID ID넣기
 */
export function deleteProduct(ID) {
  const apiUrl = `https://sprint-mission-api.vercel.app/products/${ID || null}`;
  axios
    .delete(apiUrl)
    .then(() => {
      console.log(`${ID} 번 제품을 삭제했습니다`);
    })
    .catch((error) => {
      console.error(`${ID} 번 제품 삭제에 실패했습니다: ${error.message}`);
    });
}
