// main.js

import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./ArticleService.js";
import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./ProductService.js";

// Article API 테스트
async function testArticleAPI() {
  // 함수 이름을 testArticleAPI로 정의
  try {
    const articleList = await getArticleList(1, 10, "New");
    console.log("Article List:", articleList);

    const newArticle = await createArticle(
      "New Title",
      "New Content",
      "image.jpg"
    );
    console.log("Create Article:", newArticle);

    const newArticleId = newArticle.id;

    const articleDetail = await getArticle(newArticleId);
    console.log("Article Detail:", articleDetail);

    const updatedArticle = await patchArticle(newArticleId, {
      title: "Updated Title",
      content: "Updated Content",
      image: "new_image.jpg",
    });
    console.log("Patch Article:", updatedArticle);

    const articleDetailAfterPatch = await getArticle(newArticleId);
    console.log("Article Detail:", articleDetailAfterPatch);

    const deletedArticle = await deleteArticle(newArticleId);
    console.log("Delete Article:", deletedArticle);
  } catch (error) {
    console.error("Article API Error:", error);
  }
}

// Product API 테스트
async function testProductAPI() {
  try {
    const productList = await getProductList(1, 10, "keyword");
    console.log("Product List:", productList);

    const newProduct = await createProduct(
      "New Product",
      "Description",
      100,
      ["tag1", "tag2"],
      ["image1.jpg"]
    );
    console.log("Create Product:", newProduct);

    const newProductId = newProduct.id;

    const productDetail = await getProduct(newProductId);
    console.log("Product Detail:", productDetail);

    const updatedProduct = await patchProduct(newProductId, {
      name: "Updated Product",
    });
    console.log("Patch Product:", updatedProduct);

    const productDetailAfterPatch = await getProduct(newProductId);
    console.log("Product Detail:", productDetailAfterPatch);

    const deletedProduct = await deleteProduct(newProductId);
    console.log("Delete Product:", deletedProduct);
  } catch (error) {
    console.error("Product API Error:", error);
  }
}

// API 테스트 실행
async function testAPIs() {
  await testArticleAPI(); // testArticleAPI 함수 호출
  await testProductAPI(); // testProductAPI 함수 호출
}

testAPIs();
