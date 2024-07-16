import axios from 'axios';

export const getProductList = async (page = 1, pageSize = 100, keyword = '') => {
    try {
        const response = await axios.get('https://sprint-mission-api.vercel.app/products', {
            params: { page, pageSize, keyword }
        });
        return response.data;
    } catch (error) {
        console.error('상품 목록을 가져오는 중 에러 발생:', error);
        throw error;
    }
};

export const getProduct = async (id) => {
    try {
        const response = await axios.get(`https://sprint-mission-api.vercel.app/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('상품을 가져오는 중 에러 발생:', error);
        throw error;
    }
};

export const createProduct = async (name, description, price, manufacturer, tags, images) => {
    try {
        const response = await axios.post('https://sprint-mission-api.vercel.app/products', {
            name, description, price, manufacturer, tags, images
        });
        console.log('상품이 생성되었습니다.');
        return response.data;
    } catch (error) {
        console.error('상품을 생성하는 중 에러 발생:', error);
        throw error;
    }
};

export const patchProduct = async (id, name, description, price, tags, images) => {
    try {
        const response = await axios.patch(`https://sprint-mission-api.vercel.app/products/${id}`, {
            name, description, price, tags, images
        });
        console.log('상품이 수정되었습니다.');
        return response.data;
    } catch (error) {
        console.error('상품을 수정하는 중 에러 발생:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        await axios.delete(`https://sprint-mission-api.vercel.app/products/${id}`);
        console.log('상품이 삭제되었습니다.');
    } catch (error) {
        console.error('상품을 삭제하는 중 에러 발생:', error);
        throw error;
    }
};