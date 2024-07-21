import axios from "axios";

const instance = axios.create({
    baseURL: 'https://sprint-mission-api.vercel.app',
    timeout: 3000,
});


// GET_List
const getProductList = async (params = {}) => {
    const res = await instance.get('/products', { params });
    return res.data;
}

// GET
const getProduct = async (id) => {
    const res = await instance.get(`/products/${id}`);
    return res.data;
}

// POST
const createProduct = async (product_data) => {
    const res = await instance.post('/products', product_data);
    return res.data;
}

// PATCH
const patchProduct = async (id, patch_data) => {
    const res = await instance.patch(`/products/${id}`, patch_data);
    return res.data;
}

// DELETE
const deleteProduct = async (id) => {
    const res = await instance.delete(`/products/${id}`);
    return res.data;
}



export {getProductList, getProduct, createProduct, patchProduct, deleteProduct}