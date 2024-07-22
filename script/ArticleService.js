export function articleErrorLog(error) {
  console.log(`에러 발생! : ${error.name}, ${error.message}`);
}

export function getArticleList( params = {}) {
  const url = new URL('https://sprint-mission-api.vercel.app/articles');
  Object.keys(params).forEach((key) => 
    url.searchParams.append(key, params[key])
  );
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error (`데이터를 불러오는데 실패했습니다...`);
      }
      return res.json();
    })
}

export function getArticle(id) {
  return fetch(`https://sprint-mission-api.vercel.app/articles/${id}`)
    .then((res) => {
      if(!res.ok) {
        throw new Error (`데이터를 불러오는데 실패했습니다...`);
      }
      return res.json();
    })
}

export function createArticle(articleData) {
  return fetch('https://sprint-mission-api.vercel.app/articles', {
    method: "POST",
    body: JSON.stringify(articleData),
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((res) => {
    if (!res.ok) {
      throw new Error ('데이터를 생성하는데 실패했습니다...');
    }
    return res.json();
  })
}

export function patchArticle(id, articleData) {
  return fetch(`https://sprint-mission-api.vercel.app/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(articleData),
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((res) => {
    if (!res.ok) {
      throw new Error ("데이터를 수정하는데 실패했습니다...");
    }
    return res.json();
  })
}

export function deleteArticle(id) {
  return fetch(`https://sprint-mission-api.vercel.app/articles/${id}`, {
    method: "DELETE",
  }).then((res) => {
    if(!res.ok) {
      throw new Error("데이터를 삭제하는데 실패했습니다...");
    } else if (res.status === 204){
      return '';
    }
    return res.json();
  })
}