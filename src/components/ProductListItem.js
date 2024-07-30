import React from 'react';
import './ProductListItem.css';

function ProductListItem({ product }) {
  return (
    <div className="product-card">
      <img src={product.images[0]} alt={product.name} className="product-image" />
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-price">{product.price}원</p>
        <p className="product-favorite"> 💙 좋아요 {product.favoriteCount}</p> 
      </div>
    </div>
  );
}

export default ProductListItem;
