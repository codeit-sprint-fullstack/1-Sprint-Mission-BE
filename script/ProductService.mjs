// import axios from 'axios';
import axios from "https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.2/esm/axios.min.js";

const instance = axios.create({
    baseURL : 'https://sprint-mission-api.vercel.app/',
})

export async function getProductList(params ={}) {
    const res = await instance.get(`products`, {
        params
    });
    return res.data
}

export async function getProduct(id) {
    const res = await instance.get(`products/${id}`);
    return res.data
}

export async function createProduct(obj) {
    const res = await instance.post(`products/`, 
        obj,
    );
    return res.data
}

export async function patchProduct(id, obj) {
    const res = await instance.patch(`products/${id}`, 
        obj,
    );
    return res.data
}

export async function deleteProduct(id) {
    const res = await instance.delete(`products/${id}`);
    return res.data
}