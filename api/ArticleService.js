export function getArticleList(params = {}) {
  const url = new URL('https://sprint-mission-api.vercel.app/articles');
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('게시글을 찾을 수 없음');
      } 
      return response.json()
    })
    .then(data => console.log(data))
    .catch((error) => console.log(error.message));
}


export function getArticle(id) {
  fetch(`https://sprint-mission-api.vercel.app/articles/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('게시글을 찾을 수 없음');
      } 
      return response.json()
    })
    .then((data) => console.log(data))
    .catch((error) => console.log(error.message));
}


export function createArticle(articleData) {
  fetch('https://sprint-mission-api.vercel.app/articles', {
    method: 'POST',
    body: JSON.stringify(articleData),
    headers: {
      'Content-Type': 'application/json'
    },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('유효성 검사 오류');
      } 
      return response.json()
    })
    .then((data) => console.log(data))
    .catch((error) => console.log(error.message));
  }


export function patchArticle(id, patchData) {
  fetch(`https://sprint-mission-api.vercel.app/articles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patchData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('게시글을 찾을 수 없음');
    } 
    return response.json()
  })
  .then((data) => console.log(data))
  .catch((error) => console.log(error.message));
}


export function deleteArticle(id) {
  fetch(`https://sprint-mission-api.vercel.app/articles/${id}`, {
    method: 'DELETE',
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('게시글을 찾을 수 없음');
    } 
    console.log('삭제되었습니다.')
  })
  .catch((error) => console.log(error.message));
} 