// Article API 
// getArticleList() : GET 메서드를 사용해 주세요. : page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
// getArticle() : GET 메서드를 사용해 주세요.
// createArticle() : POST 메서드를 사용해 주세요. : request body에 title, content, image 를 포함해 주세요.
// patchArticle() : PATCH 메서드를 사용해 주세요.
// deleteArticle() : DELETE 메서드를 사용해 주세요.
// fetch : 응답의 상태 코드가 2XX가 아닐 경우, 에러메시지를 콘솔에 출력해 주세요.
// .then()
// .catch()
//id, title, content, image, likeCount

const baseurl = 'https://sprint-mission-api.vercel.app/articles'

export async function getArticleList(page, pageSize, keyword) {
  try {
    if (!keyword) {
      var res = await fetch(`${baseurl}?page=${page}&pageSize=${pageSize}`);
    } else {
      var res = await fetch(`${baseurl}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`);
    }
    const data = await res.json();
    return data;
  } catch (e) {
      console.log(e.name + ':' + e.message);
  }
}

export async function getArticle(id) {
  try {
    if (!id) {
      var res = await fetch(`${baseurl}`);
    } else {
      var res = await fetch(`${baseurl}/${id}`);
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e.name + ':' + e.message);
  }
}

export async function createArticle(requestBody) {
  await fetch(`${baseurl}`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(() => {
    alert('저장되었습니다.');
    location.reload(true);
  })
  .catch((e) => console.log(e.name + ':' + e.message));
}

export async function patchArticle(id,requestBody) {
  await fetch(`${baseurl}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(() => {
    alert('수정되었습니다.');
    location.reload(true);
  })
  .catch((e) => console.log(e.name + ':' + e.message));
}

export async function deleteArticle(id) {
  await fetch(`${baseurl}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(() => {
    alert('삭제되었습니다.');
    location.reload(true);
  })
  .catch((e) => console.log(e.name + ':' + e.message));
}

