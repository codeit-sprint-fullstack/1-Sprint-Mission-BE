import * as Article from "./ArticleService.mjs";
import * as Product from "./ProductService.mjs";

// get ArticleList

try {
  const articles = await Article.getArticleList({
    page: 1,
    pageSize: 10,
    keyword: "",
  });
  console.log("게시글 목록:", articles);
} catch (error) {
  console.error("게시글 목록 조회 실패:", error.message);
}

// get Article

// try {
//   const article = await Article.getArticle(123);
//   console.log("게시글 조회중:", article);
// } catch (error) {
//   console.error("게시글 조회 실패:", error.message);
// }

// create Article

// try {
//   const newArticle = await Article.createArticle({
//     title: "",
//     content: "",
//     image: "",
//   });
//   console.log("게시글 생성 완료:", newArticle);
// } catch (error) {
//   console.error("게시글 생성 실패:", error.message);
// }

// patch Article

// try {
//   const updatedArticle = await Article.patchArticle({
//     ID: 123,
//     title: "",
//     content: "",
//     image: [""],
//   });
//   console.log("게시글 수정 완료:", updatedArticle);
// } catch (error) {
//   console.error("게시글 수정 실패:", error.message);
// }

// delete Article

// try {
//   const result = await Article.deleteArticle();
//   console.log(result.message);
// } catch (error) {
//   console.error("게시글 삭제 실패:", error.message);
// }



// get ProductList

try {
  const Products = await Product.getProductList({
    page: 1,
    pageSize: 10,
    keyword: "",
  });
  console.log("제품 목록:", Products);
} catch (error) {
  console.error("제품 목록 조회 실패:", error.message);
}

// get Product

// try {
//   const Product = await Product.getProduct(123);
//   console.log("제품 조회중:", Product);
// } catch (error) {
//   console.error("제품 조회 실패:", error.message);
// }

// create Product

// try {
//   const newProduct = await Product.createProduct({
//     title: "",
//     content: "",
//     image: "",
//   });
//   console.log("제품 생성 완료:", newProduct);
// } catch (error) {
//   console.error("제품 생성 실패:", error.message);
// }

// patch Product

// try {
//   const updatedProduct = await Product.patchProduct({
//     ID: 123,
//     title: "",
//     content: "",
//     image: [""],
//   });
//   console.log("제품 수정 완료:", updatedProduct);
// } catch (error) {
//   console.error("제품 수정 실패:", error.message);
// }

// delete Product

// try {
//   const result = await Product.deleteProduct();
//   console.log(result.message);
// } catch (error) {
//   console.error("제품 삭제 실패:", error.message);
// }
