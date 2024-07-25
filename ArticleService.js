// ArticleService.js

const BASE_URL = "https://sprint-mission-api.vercel.app/articles";

// GET /articles - 게시글 목록 조회
const params = {
  page,
  pageSize,
  keyword,
};
const url = new URL(BASE_URL);
Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch article list");
    }
    return response.json();
  })
  .catch((error) => console.error("Error:", error));

// GET /articles/{id} - 게시글 상세 조회
export function getArticle(id) {
  return fetch(`${BASE_URL}/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch article with id ${id}`);
      }
      return response.json();
    })
    .catch((error) => console.error("Error:", error));
}

// POST /articles - 게시글 등록
export function createArticle(title, content, image) {
  return fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content, image }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to create article");
      }
      return response.json();
    })
    .catch((error) => console.error("Error:", error));
}

// PATCH /articles/{id} - 게시글 수정
export function patchArticle(id, data) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to update article with id ${id}`);
      }
      return response.json();
    })
    .catch((error) => console.error("Error:", error));
}

// DELETE /articles/{id} - 게시글 삭제
export function deleteArticle(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to delete article with id ${id}`);
      }
      return response.text(); // JSON 대신 텍스트로 응답을 처리
    })
    .catch((error) => console.error("Error:", error));
}
