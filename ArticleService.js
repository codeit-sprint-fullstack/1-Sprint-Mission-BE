export async function getArticleList(params = {}) {
  const url = new URL('https://sprint-mission-api.vercel.app/articles')
  Object.keys(params).forEach((key) =>
  url.searchParams.append(key, params[key])
  );

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        return response.text().then(message => {throw new Error(message)});
      }
      return response.json();
    })
    .then((data) => {return data;})
    .catch((error) => console.log('Error'));
}

export async function getArticle(id) {
  fetch(`https://sprint-mission-api.vercel.app/articles/${id}`)
  .then((response) => {
    if (!response.ok) {
      return response.text().then(message => {throw new Error(message)});
    }
    return response.json();
  })
  .then((data) => {return data;})
  .catch((error) => console.log('Error'));
}

export async function createArticle(requestData) {
  fetch('https://sprint-mission-api.vercel.app/articles', {
    method: 'POST',
    body: JSON.stringify(requestData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    if (!response.ok) {
      return response.text().then(message => {throw new Error(message)});
    }
    return response.json();
  })
  .then((data) => {return data;})
  .catch((error) => console.log('Error'));
}

export async function patchArticle(id, requestData) {
  fetch(`https://sprint-mission-api.vercel.app/articles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(requestData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    if (!response.ok) {
      return response.text().then(message => {throw new Error(message)});
    }
    return response.json();
  })
  .then((data) => {return data;})
  .catch((error) => console.log('Error'));
}

export async function deleteArticle(id) {
  fetch(`https://sprint-mission-api.vercel.app/articles/${id}`, {
    method: 'DELETE',
  })
  .then((response) => {
    if (!response.ok) {
      return response.text().then(message => {throw new Error(message)});
    }
    return response.json();
  })
  .then((data) => {return data;})
  .catch((error) => console.log('Error'));
}
