import axios from "axios";

const apiUrl = "https://sprint-mission-api.vercel.app/Products";
const headers = {
  "Content-Type": "application/json",
};

/** 제품 목록 조회 함수
 * @param {number} page 몇번째 페이지로 할것이냐?
 * @param {number} pageSize 한페이지에 몇개의 제품이 나오게 할 것인가?
 * @param {string} keyword 키워드
 */
export async function getProductList({ page = 1, pageSize = 10, keyword }) {
  try {
    const url = `${apiUrl}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`;

    const response = await fetch(url, {
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Maybe Network Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

/** 제품 개별 조회 함수
 * @param {number} ID 제품의 ID를 넣자
 */
export async function getProduct(ID) {
  if (!ID) throw new Error("No ID founded");
  const url = `${apiUrl}/${ID}`;
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

/** 제품 작성 함수
 * @param {string} title 제품의 제목을 넣자
 * @param {string} content 제품의 내용을 넣자
 * @param {string} image 제품의 이미지를 넣자
 */
export async function createProduct({ title, content, image }) {
  try {
    const response = await axios.post(apiUrl, { title, content, image });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

/** 제품 수정 함수
 * @param {number} ID 수정할 제품의 ID를 넣자
 * @param {string} title 수정할 제품의 제목을 넣자
 * @param {string} content 수정할 제품의 내용을 넣자
 * @param {Array} image 수정할 제품의 이미지를 배열로 넣자
 */
export async function patchProduct({ ID, title, content, image }) {
  if (!ID) throw new Error("No ID founded");
  const url = `${apiUrl}/${ID}`;
  try {
    const response = await axios.patch(url, { title, content, image });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

/** 제품 삭제 함수
 * @param {number} ID 제품의 ID를 넣자
 */
export async function deleteProduct(ID) {
  if (!ID) throw new Error("No ID founded");
  const url = `${apiUrl}/${ID}`;
  try {
    await axios.delete(url);
    console.log(`${ID}번 제품을 삭제했습니다`);
    return { success: true, message: `${ID}번 제품을 삭제했습니다` };
  } catch (error) {
    console.error(`${ID}번 제품 삭제에 실패했습니다: ${error.message}`);
    throw error;
  }
}
