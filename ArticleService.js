const basicUrl = 'https://sprint-mission-api.vercel.app/articles';

export async function getArticleList(){
  const params = {
    page: 1,
    pageSize: 30,
    keyword: '추천'
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
