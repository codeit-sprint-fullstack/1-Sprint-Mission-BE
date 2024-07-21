import axios from 'axios';

const URL = 'https://sprint-mission-api.vercel.app/products';

export async function getProductList(page, pageSize, keyword) {
    try {
        const response = await axios.get(URL, {params: { page, pageSize, keyword }});
        return response.data;
    } catch (error) {
        console.error('Fail getList Error : ', error);
        throw error;
    }
}

export async function getProduct(id) {
    try {
        const response = await axios.get(`${URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Fail get ID-${id} Error :`, error);
        throw error;
    }
}

export async function createProduct(name, description, price, tags, images) {
    try {
        const response = await axios.post(URL, { name, description, price, tags, images });
        return response.data;
    } catch (error) {
        console.error('Fail Create Error :', error);
        throw error;
    }
}

export async function patchProduct(id, data) {
    try {
        const response = await axios.patch(`${URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Fail Update Error ID-${id} :`, error);
        throw error;
    }
}

export async function deleteProduct(id) {
    try {
        const response = await axios.delete(`${URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Fail Delete Error ID-${id} :`, error);
        throw error;
    }
}
