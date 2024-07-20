//require to use fetch and then

const url = new URL('https://sprint-mission-api.vercel.app/articles');

export function getArticleList(params = {}) {
  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key]);
  });

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.status);
      } else {
        return res.json();
      }
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}

export function getArticle(id) {
  fetch(`${url}/${id}`)
    .then((res) => {
      if (res.status === 404) {
        throw new Error(`${res.status}: ID is not existed.`);
      } else if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}

export function createArticle(title, content, image) {
  const newArticle = {
    title: title,
    content: content,
    image: image,
  };
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newArticle),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.status);
      } else {
        return res.json();
      }
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}

export function patchArticle(id, amendData) {
  fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(amendData),
  })
    .then((res) => {
      if (res.status === 404) {
        throw new Error(`${res.status}: ID is not existed.`);
      } else if (!res.ok) {
        throw new Error(res.status);
      } else {
        return res.json();
      }
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}

export function deleteArticle(id) {
  fetch(`${url}/${id}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (res.status === 404) {
        throw new Error(`${res.status}: ID is not existed.`);
      } else if (!res.ok) {
        throw new Error(res.status);
      } else {
        return {
          status: res.status,
          message: 'The article has deleted successfully',
        };
      }
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}
