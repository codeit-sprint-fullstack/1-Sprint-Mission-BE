import fetch from 'node-fetch';

export const getArticleList = (page = 1, pageSize = 100, keyword = '') => {
    return fetch(`https://sprint-mission-api.vercel.app/articles?page=${page}&pageSize=${pageSize}&keyword=${keyword}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`에러: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => console.error('게시글 목록을 가져오는 중 에러 발생:', error));
};

export const getArticle = (id) => {
    return fetch(`https://sprint-mission-api.vercel.app/articles/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`에러: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => console.error('게시글을 가져오는 중 에러 발생:', error));
};

export const createArticle = (title, content, image) => {
    return fetch('https://sprint-mission-api.vercel.app/articles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, image })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`에러: ${response.statusText}`);
            }
            console.log('게시글이 생성되었습니다.');
            return response.json();
        })
        .catch(error => console.error('게시글을 생성하는 중 에러 발생:', error));
};

export const patchArticle = (id, title, content, image) => {
    return fetch(`https://sprint-mission-api.vercel.app/articles/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, image })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`에러: ${response.statusText}`);
            }
            console.log('게시글이 수정되었습니다.');
            return response.json();
        })
        .catch(error => console.error('게시글을 수정하는 중 에러 발생:', error));
};

