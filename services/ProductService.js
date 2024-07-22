import axios from 'axios';

const baseUrl = 'https://sprint-mission-api.vercel.app/products';

// Get products List
export async function getProductList(keyword, page=1, pageSize=100) {
    try {
        const response = await axios.get(baseUrl, {
            params: { page, pageSize, keyword }
        });
        console.log('성공');
        console.log(response.data);
    }catch(error) {
        console.error('Get ProductList Error',error);
    }
}

// Get a product
export async function getProduct(id) {
    try {
        const response = await axios.get(`${baseUrl}/${id}`);
        console.log('성공');
        console.log(response.data);
    }catch(error) {
        console.error('상품을 찾을 수 없음');
    }
}

// Post a product
export async function postProduct(name,  description, price, tags, images) {
    try {
        const response = await axios.post(baseUrl, {
            name,
            description,
            price,
            tags,
            images
        });
        console.log(response.data);
        console.log('성공');
    }catch(error) {
        console.error('유효성 검사 오류');
    }
}

// PATCH 메서드를 사용하여 제품 수정하기
export async function patchProduct(id, updates) {
    try {
        const response = await axios.patch(`${baseUrl}/${id}`, updates);
        console.log('성공');
        console.log(response.data);
    } catch (error) {
        console.error('상품을 찾을 수 없음');
    }
}

// DELETE 메서드를 사용하여 제품 삭제하기
export async function deleteProduct(id) {
    try {
        const response = await axios.delete(`${baseUrl}/${id}`);
        console.log('성공적으로 삭제됨');
        console.log(response.data);
    } catch (error) {
        console.error('상품을 찾을 수 없음');
    }
}