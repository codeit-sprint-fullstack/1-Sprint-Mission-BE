import React from 'react';

function BestProductItem ({ product }){
    return (
        <div className="bestProductItem-card">
          <img src={product.images[0]} alt={product.name} className="bestProduct-image" />
          <div className="product-info">
            <p className="product-name">{product.name}</p>
            <p className="product-price">{product.price}원</p>
            <p className="product-favorite"> 💙 좋아요 {product.favoriteCount}</p> 
          </div>
        </div>
      );
};

export default BestProductItem;