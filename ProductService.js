import axios from "axios";

export async function getProductList(params = {}) {
  try {
    const res = await axios.get(
      'https://sprint-mission-api.vercel.app/products',
      { params },
    );
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
}

export async function getProduct(id) {
  try {
    const res = await axios.get(`https://sprint-mission-api.vercel.app/products/${id}`);
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
}

export async function createProduct(requestData) {
  try {
    const res = await axios.post(
      'https://sprint-mission-api.vercel.app/products',
      requestData,
    )
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
}

export async function patchProduct(id, requestData) {
  try {
    const res = await axios.patch(
      `https://sprint-mission-api.vercel.app/products/${id}`,
      requestData,
    );
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
}

export async function deleteProduct(id) {
  try {
    const res = await axios.delete(`https://sprint-mission-api.vercel.app/products/${id}`);
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
}
