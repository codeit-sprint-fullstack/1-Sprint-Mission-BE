const baseUrl = 'https://sprint-mission-api.vercel.app/articles';

// Get articles keyword List
export function getArticleList(keyword, page =1, pageSize=100) {
    const url = new URL(baseUrl);
    const params = {
        page,
        pageSize,
        keyword
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GET Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('성공');
            console.log(data);
        })
        .catch(error => console.error(`GET Error fetching article list:`, error));
}

// Get a single article
export function getArticle(id) {
    fetch(`${baseUrl}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GET Single Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('성공');
            console.log(data);
        })
        .catch(() => console.error('게시글을 찾을 수 없음'));
}

//post a new article
export function postArticle(title, content, image) {
    fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                content,
                image
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`POST Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('성공');
            console.log(data);
        })
        .catch(() => console.error('유효성 검사 오류'));
}

// // Patch an article
export function patchArticle(id, updates) {
    fetch(`${baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    })
        .then(async response => {
            if (!response.ok) {
                const errorInfo = await response.json();
                throw new Error(`PATCH Error: ${response.statusText}, Details: ${JSON.stringify(errorInfo)}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('성공');
            console.log(data);
        })
        .catch(() => console.error('게시글을 찾을 수 없음'));
}

//Delete an article
export function deleteArticle(id) {
    fetch(`${baseUrl}/${id}`, { 
        method: 'DELETE' 
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`DELETE Error: ${response.statusText}`);
            }
        })
        .then(data => {
            console.log('성공적으로 삭제됨');
        })
        .catch(() => console.error('게시글을 찾을 수 없음'));
}