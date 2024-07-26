import axios from "axios";

const BASE_URL = "https://sprint-mission-api.vercel.app/products";

// GET /products - 상품 목록 조회
export async function getProductList(page, pageSize, keyword) {
  try {
    const response = await axios.get(BASE_URL, {
      params: { page, pageSize, keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// GET /products/{id} - 상품 상세 조회
export async function getProduct(id) {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// POST /products - 상품 등록
export async function createProduct(name, description, price, tags, images) {
  try {
    const response = await axios.post(BASE_URL, {
      name,
      description,
      price,
      tags,
      images,
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// PATCH /products/{id} - 상품 수정
export async function patchProduct(id, data) {
  try {
    const response = await axios.patch(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// DELETE /products/{id} - 상품 삭제
export async function deleteProduct(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
