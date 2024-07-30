import React, { useEffect, useState } from 'react';
import searchIcon from './assets/images/ic_search.png';
import Header from './components/Header';
import BestProducts from './components/BestProducts';
import ProductList from './components/ProductList';
import Pagination from './components/Pagination';
import { getProductList } from './api/api';
import { filterProductsByName } from './api/api';
import './App.css';

const LIMIT = 5;

function App() {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState('createdAt');
  const [loadingError, setLoadingError] = useState(null);

  // 검색 기능
  const [searchProduct, setSearchProduct] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

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

  const handleSearchChange = (event) => {
    setSearchProduct(event.target.value);
  };

  // 검색 기능
  const handleSearchClick = async () => {
    try {
      if (searchProduct.trim() === '') {
        setSearchResults([]);
        setSearchError('⚠ 검색어를 입력해 주세요.');
        return;
      }
      const results = filterProductsByName(products, searchProduct);
      if (results.length === 0) {
        setSearchResults([]);
        setSearchError('상품이 존재하지 않습니다.');
      } else {
        setSearchResults(results);
        setSearchError(null);
      }
    } catch (error) {
      setSearchError('검색 중 오류가 발생했습니다.');
      console.error('검색 오류', error);
    }
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
              value={searchProduct}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearchClick} className="search-button">검색</button>
            <button className='addProductBotton'>상품 등록하기</button>
            <select className="sortDropDown" onChange={handleOrderChange}>
              <option value="createdAt">최신순</option>
              <option value="favoriteCount">좋아요순</option>
            </select>
          </div>
        </div>
        {searchError && <div className="search-error">{searchError}</div>}
        {searchProduct && searchResults.length > 0 && (
          <div className="search-results">
            <h3>검색 결과</h3>
            <ul>
              {searchResults.map((product) => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
          </div>
        )}
        {loadingError && <p>{loadingError}</p>}
        <ProductList products={searchProduct ? searchResults : sortedProducts} />
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageClick} 
          hasNext={hasNext} 
        />
      </main>
    </div>
  );
}

export default App;
