import axios from "axios";

const apiUrl = "https://sprint-mission-api.vercel.app/articles";
const headers = {
  "Content-Type": "application/json",
};

/** 게시글 목록 조회 함수
 * @param {number} page 몇번째 페이지로 할것이냐?
 * @param {number} pageSize 한페이지에 몇개의 게시물이 나오게 할 것인가?
 * @param {string} keyword 키워드
 */
export async function getArticleList(page, pageSize, keyword) {
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

/** 게시글 개별 조회 함수
 * @param {number} ID 글의 ID를 넣자
 */
export async function getArticle() {
  const apiUrl = `https://sprint-mission-api.vercel.app/articles/${ID || 2}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.error("뭔가 안됐음:", error);
  }
}

/** 게시글 작성 함수
 * @param {string} title 글의 제목을 넣자
 * @param {string} content 글의 내용을 넣자
 * @param {string} image 글의 이미지를 넣자
 */
export function createArticle(title, content, image) {
  axios
    .post(apiUrl, {
      title: title,
      content: content,
      image: image,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}

/** 게시글 수정 함수
 * @param {number} ID 수정할 글의 ID를 넣자
 * @param {string} title 수정할 글의 제목을 넣자
 * @param {string} content 수정할 글의 내용을 넣자
 * @param {Array} image 수정할 글의 이미지를 배열로 넣자
 */
export function patchArticle(ID, title, content, image) {
  const apiUrl = `https://sprint-mission-api.vercel.app/articles/${ID || null}`;
  axios
    .patch(apiUrl, {
      title: title,
      content: content,
      image: image,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}

/** 게시글 삭제 함수
 * @param {number} ID 글의 ID를 넣자
 */
export function deleteArticle(ID) {
  const apiUrl = `https://sprint-mission-api.vercel.app/articles/${ID || null}`;
  axios
    .delete(apiUrl)
    .then(() => {
      console.log(`${ID} 번 게시글을 삭제했습니다`);
    })
    .catch((error) => {
      console.error(`${ID} 번 게시글 삭제에 실패했습니다: ${error.message}`);
    });
}
