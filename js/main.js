import * as article from "./ArticleService.js";
import * as product from "./ProductService.js";


// const data = await product.getProductList(1, 5);

// const data = await product.getProduct(2);

// const data = await product.createProduct("wolverene ver3", "marvel hot toy", 480000, "MARVEL", ["X-MAN", "wolverene", "Logan"], ["https://telegra.ph/file/58226d9dd211ecb20c665.jpg"]);

// const data = product.getPatchBodyFrame();
// const body = {
//     "name" : "wolverene ver4", 
//     "description" : "marvel hot toy", 
//     "price" : 380000, 
//     "manufacturer" : "MARVEL", 
//     "tags" : ["X-MAN", "wolverene", "Logan"], 
//     "images" : ["https://telegra.ph/file/58226d9dd211ecb20c665.jpg"]};
// const data = await product.patchProduct(11, body);

// const data = await product.deleteProduct(15);

// console.log(data);


// const data = await article.getArticleList(1, 4);

// const data = await article.getArticle(6);

// const data = await article.createAritcle("테스트용으로 만든 글 제목", "fetch 사용할 때 주의사항이 뭘까?", "https://telegra.ph/file/c75794e72a2569f0c0426.png");

// const data = article.getPatchBodyFrame();
// const body = {
//     "title" : "테스트용으로 만든 글 제목00",
//     "content" : "fetch 사용할 때 주의사항이 뭘까?",
//     "image" : "https://telegra.ph/file/c75794e72a2569f0c0426.png"
// }
// const data = await article.pathArticle(83, body);

const data = await article.deleteArticle(84);

console.log(data);