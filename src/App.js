import React, { useEffect, useState } from 'react';
import searchIcon from './assets/images/ic_search.png';
import Header from './components/Header';
import BestProducts from './components/BestProducts';
import ProductList from './components/ProductList';
import { getProductList } from './api/api';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState('createdAt');
  const [loadingError, setLoadingError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductList({ order });
        setProducts(response.list || []);
      } catch (error) {
        setLoadingError('상품을 불러오는 데 실패했습니다.');
      }
    };

    fetchProducts();
  }, [order]);

  const handleOrderChange = (event) => {
    setOrder(event.target.value);
  };


  // 정렬 함수
  const sortedProducts = [...products].sort((a, b) => {
    if (order === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (order === 'favoriteCount') {
      return b.favoriteCount - a.favoriteCount;
    }
    return 0;
  });

  return (
    <div className='App'>
      <Header />
      <main>
        <h2>베스트 상품</h2>
        <BestProducts />
        <div className='SaleProductNav'>
          <h2>판매 중인 상품</h2>
          <div className='inputBtDrop'>
            <input 
              type="text" 
              placeholder="검색할 상품을 입력해주세요" 
              className="search-input" 
              style={{ backgroundImage: `url(${searchIcon})` }}
            />
            <button className="search-button">검색</button>
            <button className='addProductBotton'>상품 등록하기</button>
            <select className="sortDropDown" onChange={handleOrderChange} value={order}>
              <option value="createdAt">최신순</option>
              <option value="favoriteCount">좋아요순</option>
            </select>
          </div>
        </div>
        {loadingError && <p>{loadingError}</p>}
        <ProductList products={sortedProducts}/>
      </main>
    </div>
  );
}

export default App;
