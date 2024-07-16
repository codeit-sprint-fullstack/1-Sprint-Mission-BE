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

  const res = await fetch(url);
  const data = await res.json();
  
  console.log(data);
}

export async function getArticle(id){
  const url = `${basicUrl}/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  console.log(data);
}

export async function createArticle(articleContent){
  const url = basicUrl;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify(articleContent),
  });
  const data = await res.json();

  console.log(data);
}

export async function patchArticle(id, updateContent){
  const url = `${basicUrl}/${id}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify(updateContent),
  });

  const data = await res.json();

  console.log(data);
}

export async function deleteArticle(id){
  const url = `${basicUrl}/${id}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type' : 'application/json',
    },
  });

  const data = await res.text();

  console.log(data);
}