export function getArticleList(options = {}) {
  const url = new URL('https://sprint-mission-api.vercel.app/articles');
  const {page=1, pageSize=100, keyword} = options;
  const params = {
    page: page,
    pageSize: pageSize
  }

  // Add query parameter to URL
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  // If keyword parameter given, add to URL
  if (keyword) {
    url.searchParams.append('keyword', keyword);
  }

  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`Network response is not 2XX: ${res.status}`);
    }
    return res.json(); 
  })
  .catch((e) => {
    console.error('Error: ', e.message);
    return null;
  });
}

export function getArticle(id) {
  const url = new URL(`https://sprint-mission-api.vercel.app/articles/${id}`);

  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`Network response is not 2XX: ${res.status}`);
    }
    return res.json();
  })
  .catch((e) => {
    console.error('Error: ', e.message);
    return null;
  })
}