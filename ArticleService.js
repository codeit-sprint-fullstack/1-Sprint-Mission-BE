import axios from "axios";

export const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

// const url = "";

export async function getArticles(article_id) {
  const getRes = await fetch(`http://sprint-mission-api.vercel.app/articles/${article_id}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      return data
    })
    .catch((err) => console.log(err));
}

export async function addArticles(title, content, image) {
  const res = await fetch(`http://sprint-mission-api.vercel.app/articles`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
      image,
    }),
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
    return data
  })
  .catch((err) => console.log(err));
}

export async function deleteArticles(article_id) {
  const res = await fetch(`http://sprint-mission-api.vercel.app/articles/${article_id}`, {
    method: "DELETE",
  })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => console.log(err));
}

export async function getArticlesList(page=1,pageSize=100,keyword) {
  const getRes = await fetch(`http://sprint-mission-api.vercel.app/articles`)
  .then((res) => res.json())
  .then((data) => {
    if (keyword) {
      const filteredArticles = data.filter(article => 
        article.title.includes(keyword) || 
        article.content.includes(keyword)
      );
      return filteredArticles;
    }
    return data;
  })
  .then((filteredArticles) => {
    console.log(filteredArticles);
    return filteredArticles;
  })
  .catch((err) => console.log(err));
}

export async function updateArticles(article_id,data) {
  const res = await fetch(`http://sprint-mission-api.vercel.app/articles/${article_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => console.log(err));
  
}

// addArticles("1", "2", "3");
// getArticles(3);

// getArticlesList(1,100,"마이크")
// deleteArticles(63);
// updateArticles(78,{title:"김",content:"국내산"})