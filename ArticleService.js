const basicUrl = 'https://sprint-mission-api.vercel.app/articles';

export async function getArticleList({page = 1, pageSize = 10, keyword = ''} = {}){
  const params = {
    page,
    pageSize,
    keyword,
  };
  const url = new URL(basicUrl);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  fetch(url)
  .then((res) => {
    if(!res.ok) throw new Error(res.status);
    else return res.json();
  })
  .then((data) => console.log(data))
  .catch((error) => console.log(`Error : ${error}`));
}

export function getArticle(id){
  const url = `${basicUrl}/${id}`;

  fetch(url)
  .then((res) => {
    if(!res.ok) throw new Error(res.status);
    else return res.json();
  })
  .then((data) => console.log(data))
  .catch((error) => console.log(`Error : ${error}`));
}

export function createArticle(articleContent){
  const url = basicUrl;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify(articleContent),
  })
  .then((res) => {
    if(!res.ok) throw new Error(res.status);
    else return res.json();
  })
  .then((data) => console.log(data))
  .catch((error) => console.log(`Error : ${error}`));
}

export function patchArticle(id, updateContent){
  const url = `${basicUrl}/${id}`;

  fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify(updateContent),
  })
  .then((res) => {
    if(!res.ok) throw new Error(res.status);
    else return res.json();
  })
  .then((data) => console.log(data))
  .catch((error) => console.log(`Error : ${error}`));
}

export function deleteArticle(id){
  const url = `${basicUrl}/${id}`;

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type' : 'application/json',
    },
  })
  .then((res) => {
    if(!res.ok) throw new Error(res.status);
    else return res.text();
  })
  .then((data) => console.log(data))
  .then(() => console.log("delete successful"))
  .catch((error) => console.log(`Error : ${error}`));
}