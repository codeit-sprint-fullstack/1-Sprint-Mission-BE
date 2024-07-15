import axios from "axios";

const apiUrl = "https://sprint-mission-api.vercel.app/products";
const headers = {
  "Content-Type": "application/json",
};

async function getProductList(page, pageSize, keyword) {
  try {
    const url = `${apiUrl}?page=${page || 1}&pageSize=${
      pageSize || 100
    }&keyword=${keyword || ""}`;

    const response = await fetch(url, {
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`200번대 안나옴: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("뭔가 문제있음:", error.message);
    throw error;
  }
}

export async function getProduct(ID) {
  const apiUrl = `https://sprint-mission-api.vercel.app/products/${ID || 2}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.error("또안됨:", error);
  }
}

export function createProduct() {}

export function patchProduct() {}

export function deleteProduct() {}

getProductList();
