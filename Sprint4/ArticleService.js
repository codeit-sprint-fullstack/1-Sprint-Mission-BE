import axios from "axios";

// 응답 상태코드가 2xx 인지 확인, 아닐경우 에러 메시지 출력
export async function checkStatus(res) {
    // 요청 성공적으로 처리했을 때
    if(res.status >= 200 && res.status < 300){ 
      const data = await res.json(); //res.json 비동기 함수 
      return console.log('요청을 성공적으로 처리했습니다.', data);
    }else{
      throw new Error(`Error code: ${res.status}`);
    }
  }


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

export async function patchArticle(articleId, updatedContent){
    const response = await fetch(`https://sprint-mission-api.vercel.app/articles/${articleId}`, 
        {
        method: 'PATCH',
        body: JSON.stringify(updatedContent),
        headers: {
            'Content-Type': 'application/json',
          },
      })
      .then(checkStatus)
      .catch(error => console.error(error));
}

export async function deleteArticle(articleId){
    const response = await fetch(`https://sprint-mission-api.vercel.app/articles/${articleId}`, {
        method: 'DELETE',
        })
        .then((response) => {if(response.status >= 200 && response.status < 300)
        console.log('성공적으로 삭제했습니다.');
        })
        .catch(error => console.error(error));
}
