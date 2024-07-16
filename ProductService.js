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

