// main.js

import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./ArticleService.js";

// Article API 테스트
getArticleList(1, 10, "New").then((data) => console.log("Article List:", data)); // 특정 키워드로 검색

createArticle("New Title", "New Content", "image.jpg")
  .then((data) => {
    console.log("Create Article:", data);

    const newArticleId = data.id;

    getArticle(newArticleId).then((data) =>
      console.log("Article Detail:", data)
    );
    patchArticle(newArticleId, {
      title: "Updated Title",
      content: "Updated Content",
      image: "new_image.jpg",
    })
      .then((data) => {
        console.log("Patch Article:", data);

        getArticle(newArticleId).then((data) =>
          console.log("Article Detail:", data)
        );

        deleteArticle(newArticleId)
          .then((response) => {
            console.log("Delete Article:", response);
          })
          .catch((error) => console.error("Delete Article Error:", error));
      })
      .catch((error) => console.error("Patch Article Error:", error));
  })
  .catch((error) => console.error("Create Article Error:", error));
