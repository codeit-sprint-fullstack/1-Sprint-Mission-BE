import * as article from "./ArticleService.js";
import * as product from "./ProductService.js";


const data = await product.getProductList(1, 5);

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

console.log(data);

