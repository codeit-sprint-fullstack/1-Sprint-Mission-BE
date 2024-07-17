const url = new URL('https://sprint-mission-api.vercel.app/articles');

//유알엘 인코딩 -- 서버수정완료 아래 함수 미사용
// function encodingUrl(url) {
//     return encodeUrl = new URL('https://corsproxy.io/?' 
//         + encodeURIComponent(url))
// }

export async function getArticleList(params = {}) {
    const paramsUrl = new URL(url)
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => 
        searchParams.append(key, params[key]));
    paramsUrl.search = searchParams;
    const response =  await fetch(url)
    if(!response.ok) {
        throw new Error('게시글을 불러오는데 실패했습니다.');
    }
    return response;
}

export async function getArticle(id) {
    const response =  await fetch(`${url}/${id}`)
    if(!response.ok) {
        throw new Error('게시글조회의 실패했습니다.');
    }
    return response;
    
}

export async function createArticle(obj) {
    const response =  await fetch(`${url}`, 
        {
            method : 'POST',
            body : JSON.stringify(obj),
            headers : {
                'Content-type' : 'application/json',
            },
        })
        .then((res) => res.json())
    if(!response.ok) {
        throw new Error('게시글등록에 실패했습니다.');
    }
    return response;
}

export async function patchArticle(id, obj) {
    const response =  await fetch(`${url}/${id}`, 
        {
            method : 'PATCH',
            body : JSON.stringify(obj),
            headers : {
                'content-type' : 'application/json',
            },
        })
    if(!response.ok) {
        throw new Error('게시글수정에 실패했습니다.');
    }
    return response;
}

export async function deleteArticle(id) {
    const response =  await fetch(`${url}/${id}`,
        {
        method : 'DELETE',
        })
    if(!response.ok) {
        throw new Error('게시글조회의 실패했습니다.');
    }
    return response;
}