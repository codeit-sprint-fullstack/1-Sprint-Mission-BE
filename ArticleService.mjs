const URL = 'https://sprint-mission-api.vercel.app/articles';

export function getArticleList(page, pageSize, keyword) {
    return fetch(`${URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('fail : ', error);
            throw error;
        });
}

export function getArticle(id) {
    return fetch(`${URL}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error(`fail ID-${id} : `, error);
            throw error;
        });
}


export function createArticle(title, content, image) {
    return fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, image })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .catch(error => {
        console.error('fail : ', error);
        throw error;
    });
}

export function patchArticle(id, data) {
    return fetch(`${URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .catch(error => {
        console.error(`fail ID-${id} :`, error);
        throw error;
    });
}

export function deleteArticle(id) {
    return fetch(`${URL}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Fail Delete Error : ', error);
        throw error;
    });
}
