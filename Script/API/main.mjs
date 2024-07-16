import * as Article from "./ArticleService.mjs";
import * as Product from "./ProductService.mjs";

// Article.getArticleList();
// Product.getProductList();

// Article.deleteArticle(57);
// Product.deleteProduct(2);

// Article.getArticle();
// Product.getProduct();

// Article.patchArticle(2, "test", "test", "test");
// Product.patchProduct(2, "test", "test", 10, "test", ["test"], ["test"]);

Article.createArticle(
  "버즈 프로3 사도 되나요 이거?",
  "검수상태 메롱하다던데요?",
  "https://r1.community.samsung.com/t5/image/serverpage/image-id/8657665i5C5DAD5955B706FE/image-size/large?v=v2&px=999"
);

// Product.createProduct("string", "string", 10, "string", ["Array"], ["Array"]);