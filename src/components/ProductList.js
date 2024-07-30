import React from 'react';
import './ProductList.css';
import ProductListItem from './ProductListItem';


function ProductList({ products }) {
    return (
      <section className="sale-products">
        <ul className="product-list">
          {products.map((product) => (
            <ProductListItem key={product.id} product={product} />
        ))}
        </ul>
      </section>
    );
}

export default ProductList;