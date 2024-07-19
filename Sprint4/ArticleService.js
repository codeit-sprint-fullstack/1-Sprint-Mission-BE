import axios from "axios";


export async function getArticleList(page, pageSize, keyword) {
    const response = await fetch(
        `https://sprint-mission-api.vercel.app/articles?page=${page}&pageSize=${pageSize}&keyword=${keyword}`)
        .then((checkStatus))
        .catch(error => console.error(error));
}
