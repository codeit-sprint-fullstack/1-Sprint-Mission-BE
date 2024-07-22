// URL
const url = new URL(`https://sprint-mission-api.vercel.app/articles`);

// GET List
const getArticleList = async (params = {}) => {
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    return fetch(url);
} 

//GET 
const getArticle = (id) => {
    return fetch(`https://sprint-mission-api.vercel.app/articles/${id}`);
}

// POST
const createArticle = (article_data) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(article_data),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

//PATCH
const patchArticle = (id, patch_data) => {
    return fetch(`https://sprint-mission-api.vercel.app/articles/${id}`,{
        method: 'PATCH',
        body: JSON.stringify(patch_data),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

// DELETE
const deleteArticle = (id) => {
    return fetch(`https://sprint-mission-api.vercel.app/articles/${id}`, {
        method: 'DELETE',
    });
}

export { getArticleList, getArticle, createArticle, patchArticle, deleteArticle}