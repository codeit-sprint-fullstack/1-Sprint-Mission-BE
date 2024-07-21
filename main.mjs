import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from './ArticleService.mjs';
import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from './ProductService.mjs';

getArticleList(1, 10, 'id')
  .then(data => console.log(data))
  .catch(error => console.error(error));

getArticle(1)
  .then(data => console.log('Article:', data))
  .catch(error => console.error(error));

createArticle('NewUpdate', 'holymoly', '없음')
    .then(data => console.log(data))
    .catch(error => console.error(error));

patchArticle(1, { title: 'Updated Title', content: 'Updated Content' })
  .then(data => console.log('Updated Article:', data))
  .catch(error => console.error(error));

deleteArticle(1)
  .then(data => console.log('Deleted Article:', data))
  .catch(error => console.error(error));

(async () => {
  try {
    const productList = await getProductList(1, 5, '');
    console.log('Product List:', productList);

    const product = await getProduct(4);
    console.log('Product:', product);

    const newProduct = await createProduct('장난감', '성인용', 100, [레고], []);
    console.log('Created Product:', newProduct);

    const updatedProduct = await patchProduct(1, { name: '장난감', description: '유아용' });
    console.log('Updated Product:', updatedProduct);

    const deletedProduct = await deleteProduct(1);
    console.log('Deleted Product:', deletedProduct);
  } catch (error) {
    console.error(error);
  }
})();
