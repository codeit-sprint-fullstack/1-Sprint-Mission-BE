const baseUrl = 'https://sprint-mission-api.vercel.app/articles';

export function getArticleList(params = {}) {
  const { page = 1, pageSize = 10, keyword = '' } = params;

  fetch(`${baseUrl}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`, {
    method: 'GET',
  })
    .then((res) => {
      if (!res.ok) {
        const message = res.text();
        throw new Error(message);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) =>
      console.log('Article List: 데이터 불러오기에 실패했습니다')
    );
}

export function getArticle(articleId) {
  fetch(`${baseUrl}/${articleId}`, {
    method: 'GET',
  })
    .then((res) => {
      if (!res.ok) {
        const message = res.text();
        throw new Error(message);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) =>
      console.log('Get article ID: 데이터 불러오기에 실패했습니다')
    );
}

export function createArticle(articleUploadData) {
  fetch(`${baseUrl}/`, {
    method: 'POST',
    body: JSON.stringify(articleUploadData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        const message = res.text();
        throw new Error(message);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) =>
      console.log('Created article: 데이터 불러오기에 실패했습니다')
    );
}

export function patchArticle(articleId, articleUpdateData) {
  fetch(`${baseUrl}/${articleId}`, {
    method: 'PATCH',
    body: JSON.stringify(articleUpdateData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        const message = res.text();
        throw new Error(message);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) =>
      console.log('Patched article with ID: 데이터 불러오기에 실패했습니다')
    );
}

export function deleteArticle(articleId) {
  fetch(`${baseUrl}/${articleId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        const message = res.text();
        throw new Error(message);
      }
      return true;
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) =>
      console.log('Deleted article with ID: 데이터 불러오기에 실패했습니다')
    );
}
