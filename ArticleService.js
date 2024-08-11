export async function getArticleList() {
  //const article = await fetch('https://sprint-mission-api.vercel.app/articles');
  //const articleData = await article.json();
  //searchParams
  const articleURL = new URL('https://sprint-mission-api.vercel.app/articles');
  articleURL.searchParams.append('page', 1);
  articleURL.searchParams.append('pageSize', 10);
  articleURL.searchParams.append('keyword', '');
  return fetch(articleURL, { method: 'GET' })
    .then((res) => {
      if (!res.ok) {
        throw new Error('리스트를 찾을 수 없음');
      }
      console.log('성공');
      return res;
    })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}

export async function getArticle(id) {
  return fetch(`https://sprint-mission-api.vercel.app/articles/${id}`, {
    method: 'GET',
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('게시글을 찾을 수 없음');
      }
      console.log('성공');
      return res.json();
    })
    .catch((err) => console.log(err));
}

export async function createArticle(data) {
  return fetch('https://sprint-mission-api.vercel.app/articles', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('유효성 검사 오류');
      }
      console.log('성공');
      return res;
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}

export async function patchArticle(id, data) {
  return fetch(`https://sprint-mission-api.vercel.app/articles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('게시글을 찾을 수 없음');
      }
      console.log('성공');
      res;
    })
    .then((data) => data)
    .catch((err) => console.log(err));
}

export async function deleteArticle(id) {
  return fetch(`https://sprint-mission-api.vercel.app/articles/${id}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('게시글을 찾을 수 없음');
      }
      console.log('성공적으로 삭제됨');
      return res;
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}
