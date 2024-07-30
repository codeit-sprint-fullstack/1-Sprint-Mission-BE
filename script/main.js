import * as article from './ArticleService.js';
import * as product from './ProductService.mjs';
import * as obj from './object.js';

const getArticlesBtn = document.querySelector('#getarticles');
const getArticleBtn = document.querySelector('#getarticle');
const updateArticlesBtn = document.querySelector('#updatearticle');
const createArticlesBtn = document.querySelector('#createarticle');
const deletearticlesBtn = document.querySelector('#deletearticle');

const serachKeyword = document.querySelector('#keyword');
const searchId = document.querySelector('#searchid');

//GET Article List
getArticlesBtn.addEventListener('click', async () => {
    const params = {
        page : 1,
        pageSize: 100,
        keyword : serachKeyword.value,
    }
    const data = await article.getArticleList(params)
            .then((res) => res.json())
            .catch((e) => console.log(e));
    console.log(data);
})

//GET Article 
getArticleBtn.addEventListener('click', async () => {
    const data = await article.getArticle(searchId.value)
            .then((res) => res.json())
            .catch((e) => console.log(e));
    if(data) {
        renderingItem(data);
        console.log('조회완료');
    }
})

const articleTitle = document.querySelector('#articletitle');
const articleContent = document.querySelector('#articlecontent');
const articleImg = document.querySelector('#articleimg');

//Create Article 
createArticlesBtn.addEventListener('click', async () => {
    const body = new obj.createArticleBody(articleTitle.value, articleContent.value, articleImg.value)
    const data = await article.createArticle(body)
            .then((res) => res.json())
            .catch((e) => console.log(e));
    if(data) {
        renderingItem(data);
        console.log('생성완료');
    }
})

const itemId = document.querySelector('#itemid');
const itemTitle = document.querySelector('#itemtitle');
const itemContent = document.querySelector('#itemcontent');
const itemImg = document.querySelector('#itemimg');

//HTML Rendering
function renderingItem (obj) {
    itemTitle.value = obj.title;
    itemContent.value = obj.content;
    itemImg.value = obj.image;
    itemId.value = obj.id;
}

//Update Article 
updateArticlesBtn.addEventListener('click', async () => {
    const body = new obj.createArticleBody(itemTitle.value, itemContent.value, itemImg.value)
    const data = await article.patchArticle(itemId.value, body)
            .then((res) => res.json())
            .catch((e) => console.log(e));
    if(data) {
        renderingItem(data);
        console.log('수정완료');
    }
})

//Delete Article 
deletearticlesBtn.addEventListener('click', async () => {
    const data = await article.deleteArticle(itemId.value)
            .then(() => console.log(`삭제완료$`))
            .catch((e) => console.log(e));
})

//---------- axios ----------
const getProductsBtn = document.querySelector('#getproducts');
const getProductBtn = document.querySelector('#getproduct');
const updateProductBtn = document.querySelector('#updateproduct');
const createProductBtn = document.querySelector('#createproduct');
const deleteProductBtn = document.querySelector('#deleteproduct');

const productKeyword = document.querySelector('#productkeyword');

//Get Product List
getProductsBtn.addEventListener('click', async () => {
    const params = {
        page : 1,
        pageSize: 100,
        keyword : productKeyword.value,
    }
    try {
        const data = await product.getProductList(params)
        console.log(data);
        console.log('조회완료');
    } catch (e) {
        console.log(e.message);
    }
})

const ProductSearchId = document.querySelector('#productsearchid');

//Get Product 
getProductBtn.addEventListener('click', async () => {
    try {
        const data = await product.getProduct(ProductSearchId.value)
        renderingProduct(data);
        console.log('조회완료');
    } catch (e) {
        console.log(e.message);
    }
})

const productName = document.querySelector('#productname');
const productDes = document.querySelector('#productdes');
const productPrice = document.querySelector('#productprice');
const productManu = document.querySelector('#productmanu');
const productTag = document.querySelector('#producttag');
const productImage = document.querySelector('#productimage');

//Create Product 
createProductBtn.addEventListener('click', async () => {
    const body = new obj.createProduct(
        productName.value,
        productDes.value,
        productPrice.value,
        productManu.value,
        productTag.value,
        productImage.value,
    );
    try {
        const data = await product.createProduct(body)
        console.log(data);
        console.log('생성완료');
    } catch (e) {
        console.log(e.message);
    }
})

const ProductItemId = document.querySelector('#productitemid');
const productItemName = document.querySelector('#productitemname');
const productItemDes = document.querySelector('#productitemdes');
const productItemPrice = document.querySelector('#productitemprice');
const productItemManu = document.querySelector('#productitemmanu');
const productItemTag = document.querySelector('#productitemtag');
const productItemImage = document.querySelector('#productitemimage');

//Update Product 
updateProductBtn.addEventListener('click', async () => {
    const body = new obj.createProduct(
        productItemName.value,
        productItemDes.value,
        productItemPrice.value,
        productItemManu.value,
        productItemTag.value,
        productItemImage.value,
    );
    try {
        const data = await product.patchProduct(ProductItemId.value, body)
        console.log(data);
        console.log('수정완료');
    } catch (e) {
        console.log(e.message);
    }
})

function renderingProduct (obj) {
    ProductItemId.value = obj.id;
    productItemName.value = obj.name;
    productItemDes.value = obj.description;
    productItemPrice.value = obj.price;
    productItemManu.value = obj.manufacturer;
    productItemTag.value = '';
    obj.tags.forEach(element => {
        productItemTag.value += `${element}@`;
    });
    productItemImage.value = '';
    obj.images.forEach(element => {
        productItemImage.value += `${element}, `;
    });
}

//Delete Product
deleteProductBtn.addEventListener('click', async () => {
    try {
        const data = await product.deleteProduct(ProductItemId.value)
        console.log('삭제완료');
    } catch (e) {
        console.log(e.message);
    }
})