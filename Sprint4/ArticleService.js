import axios from "axios";


export async function getArticleList(page, pageSize, keyword) {
    const response = await fetch(
        `https://sprint-mission-api.vercel.app/articles?page=${page}&pageSize=${pageSize}&keyword=${keyword}`)
        .then((checkStatus))
        .catch(error => console.error(error));
}

export async function getArticle(articleId){
    const response = await fetch(`https://sprint-mission-api.vercel.app/articles/${articleId}`)
    .then(checkStatus)
    .catch(error => console.error(error)
  );
}

export async function createArticle(title, content, image){
    const response = await fetch('https://sprint-mission-api.vercel.app/articles', {
      method: 'POST',
      body: JSON.stringify({ title, content, image }),
      headers: {
          'Content-Type': 'application/json',
        },
    })
    .then(checkStatus)
    .catch(error => console.error(error));
}