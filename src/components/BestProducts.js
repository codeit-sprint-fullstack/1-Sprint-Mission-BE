import React, { useEffect, useState } from 'react';
import './BestProducts.css';
import { getProductList } from '../api/api';
import BestProductItem from './BestProductItem';

function BestProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        const response = await getProductList({ order: 'favoriteCount', offset: 0, limit: 4 });
        console.log('응답 데이터:', response); 
        
        const sortedProducts = response.list.sort((a, b) => b.favoriteCount - a.favoriteCount);
        setProducts(sortedProducts);
      } catch (error) {
        console.error('베스트 상품을 불러오는데 실패했습니다.', error);
      }
    };

    fetchBestProducts();
  }, []);

  const topProducts = products.slice(0, 4);

  return (
    <section className="best-products">
      <div className="bestProductList">
        {topProducts.map(product => (
          <BestProductItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default BestProducts;
