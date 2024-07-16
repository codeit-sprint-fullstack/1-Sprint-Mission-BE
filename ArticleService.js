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

