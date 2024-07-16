const ARTICLE_API_ORIGIN = "https://sprint-mission-api.vercel.app";

/* getArticleList 게시글 목록 조회 */
/* ===== REQUEST ===== 
origin : https://sprint-mission-api.vercel.app
path : 
method : GET
param : {
    page : / optional / default : 1 / type : integer / description : pageSize 크기로 나눠진 list의 page 번호
    pageSize : / opsional / default : 100 / type : integer / description : 배열로 보내줄 list의 최대 크기
    keyword : / optional / default : (none) / type : string / description : list 중 keyword값이 name이나 decription의 값이 포함된 상품만 선별
}
header : (default)
body : (none)
*/
/* ===== RESPONSE(data) =====
[
    {
        "id": 3,
        "title": "퀸사이즈 침대 프레임 조립 후기",
        "content": "퀸사이즈 침대 프레임을 직접 조립해본 후기입니다.",
        "image": "https://images-na.ssl-images-amazon.com/images/I/71aG%2BxDKSYL._AC_SL1500_.jpg",
        "likeCount": 6
    },
    {
        "id": 4,
        "title": "중고 노트북 거래 후기",
        "content": "중고 노트북 거래 후기를 남깁니다. 아주 만족스러웠어요.",
        "image": "https://images-na.ssl-images-amazon.com/images/I/81t2CVWEsUL._AC_SL1500_.jpg",
        "likeCount": 5
    }
]
*/
export async function getArticleList(page = 1, pageSize = 100, keyword = "")
{
    const params = {
        "page" : page,
        "pageSize" : pageSize,
        "keyword" : keyword,
    }

    const str_params = new URLSearchParams(params);
    const url = new URL(`/articles?${str_params.toString()}`, ARTICLE_API_ORIGIN);

    return fetch(url)
        .then(function(res) {
            if (!res.ok) {
                throw new Error(`getArticleList - status : ${res.status}`);
            }
        
            return res.json();
        })
        .catch((err) => {
            return err;
        });        
}

/* getArticle 게시글 상세 조회 */
/* ===== REQUEST ===== 
origin : https://sprint-mission-api.vercel.app
path : /articles/{id}
method : GET
params : (none)
header : (default)
body : (none)
*/
/* ===== RESPONSE(data) =====
{
    "id": 6,
    "title": "홈트레이닝 기구 리뷰",
    "content": "집에서 운동할 때 유용한 홈트레이닝 기구 리뷰입니다.",
    "image": "https://images-na.ssl-images-amazon.com/images/I/81N6HXJ4YPL._AC_SL1500_.jpg",
    "likeCount": 9
}
*/
export async function getArticle(id)
{
    const url = new URL(`/articles/${id}`, ARTICLE_API_ORIGIN);

    return fetch(url)
        .then(function(res) {
            if (!res.ok) {
                if(res.status === 404)
                {
                    throw new Error(`게시글을 찾을 수 없음 getArticle - status : 404`);
                }
                else
                {
                    throw new Error(`getArticle - status : ${res.status}`);
                }
            }
        
            return res.json();
        })
        .catch((err) => {
            return err;
        });   
}

/* createAritcle 게시글 등록 */
/* ===== REQUEST ===== 
origin : https://sprint-mission-api.vercel.app
path : /articles
method : POST
params : (none)
header : (default)
body : {
    title : / required / type : string / description : 게시글 제목
    content : / required / type : string / description : 게시글 내용
    image : / required / type : string / description : 게시글 이미지
}
*/
/* ===== RESPONSE(data) =====
{
    "id": 84,
    "title": "테스트용으로 만든 글 제목2",
    "content": "fetch.then 사용할 때 주의사항이 뭘까?",
    "image": "https://telegra.ph/file/c75794e72a2569f0c0426.png",
    "likeCount": 0
}
*/
export async function createAritcle(title, content, image)
{
    const body = {
        "title" : title,
        "content" : content,
        "image" : image
    };

    const option = {
        "method" : "POST",
        "headers" : {
            'Content-Type': 'application/json'
        },
        "body" : JSON.stringify(body)
    };
    
    const url = new URL(`/articles`, ARTICLE_API_ORIGIN);

    return fetch(url, option)        
        .then(function(res) {
            if (!res.ok) {
                if(res.status === 400)
                {
                    throw new Error(`유효성 검사 오류 createAritcle - status : 400`);
                }
                else
                {
                    throw new Error(`createAritcle - status : ${res.status}`);
                }
            }
        
            return res.json();
        })
        .catch((err) => {
            return err;
        });   
}

/* pathArticle 게시글 수정 */
/* ===== REQUEST ===== 
origin : https://sprint-mission-api.vercel.app
path : /articles/{id}
method : PATCH
params : (none)
header : (default)
body : {
    title : / optional / type : string / description : 게시글 제목
    content : / optional / type : string / description : 게시글 내용
    image : / optional / type : string / description : 게시글 이미지
}
*/
/* ===== RESPONSE(data) =====
{
    "id": 84,
    "title": "테스트용으로 만든 글 제목22",
    "content": "fetch.then.then 사용할 때 주의사항이 뭘까?",
    "image": "https://telegra.ph/file/c75794e72a2569f0c0426.png",
    "likeCount": 0
}
*/
export async function pathArticle(id, body)
{
    const option = {
        "method" : "PATCH",
        "headers" : {
            'Content-Type': 'application/json'
        },
        "body" : JSON.stringify(body)
    };

    const url = new URL(`/articles/${id}`, ARTICLE_API_ORIGIN);
    
    return fetch(url, option)
        .then(function(res) {
            if (!res.ok) {
                if(res.status === 404)
                {
                    throw new Error(`게시글을 찾을 수 없음 pathArticle - status : 404`);
                }
                else
                {
                    throw new Error(`pathArticle - status : ${res.status}`);
                }
            }
        
            return res.json();
        })
        .catch((err) => {
            return err;
        });  
}

/* deleteArticle 게시글 삭제 */
/* ===== REQUEST ===== 
origin : https://sprint-mission-api.vercel.app
path : /articles/{id}
method : DELETE
params : (none)
header : (default)
body : (none)
*/
/* ===== RESPONSE(data) =====
(none)
*/
export async function deleteArticle(id)
{
    const option = {
        "method" : "DELETE",
        "headers" : {
            'Content-Type': 'application/json'
        }
    };

    const url = new URL(`/articles/${id}`, ARTICLE_API_ORIGIN);

    return fetch(url, option)
        .then(function(res) {
            if (!res.ok) {
                if(res.status === 404)
                {
                    throw new Error(`게시글을 찾을 수 없음 deleteArticle - status : 404`);
                }
                else
                {
                    throw new Error(`deleteArticle - status : ${res.status}`);
                }
            }
        
            return res;
        })
        .catch((err) => {
            return err;
        }); 
}

// for patch param info
export function getPatchBodyFrame()
{
    return {
        "title" : "optional",
        "content" : "optional",
        "image" : "optional"
    };
}