import React, { useEffect, useState } from 'react';
import searchIcon from './assets/images/ic_search.png';
import Header from './components/Header';
import './App.css';
import './index.css';
import './styles/Responsive.css'; 
import BestProducts from './components/BestProducts';
import ProductList from './components/ProductList';
import { getProductList } from './api/api';
import { filterProductsByName } from './api/api';
import Pagination from './components/Pagination';

const LIMIT = 5;

function App() {
  const [order, setOrder] = useState('createdAt');
  const [products, setProducts] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [cursor, setCursor] = useState(null);

  // 검색 기능
  const [searchProduct, setSearchProduct] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPageProducts, setCurrentPageProducts] = useState([]);

  const handleLoad = async (page) => {
    try {
      setLoadingError(null);
      const response = await getProductList({ order, cursor, limit: LIMIT });
      const { paging, list, totalCount } = response; 

      const actualTotalCount = totalCount !== undefined && totalCount > 0 ? totalCount : list.length;

      console.log('서버에서 받은 전체 상품의 총 개수:', totalCount);
      console.log('수정된 전체 상품의 총 개수:', actualTotalCount);
  
      if (page === 1) {
        setProducts(list);
      } else {
        const startIndex = (page - 1) * LIMIT;
        const endIndex = page * LIMIT;
        setCurrentPageProducts(products.slice(startIndex, endIndex));
      }

      // 다음 페이지를 위한 커서를 업데이트
      setCursor(paging ? paging.nextCursor : null);
      //다음 페이지가 있는지 여부를 업데이트
      setHasNext(paging ? paging.hasNext : false);
      setTotalPages(totalCount ? Math.ceil(totalCount / LIMIT) : 5); // 총 페이지 수 설정
    } catch (error) {
      setLoadingError(error.message);
    }
  };

  // 페이지네이션 페이지 범위 설정
  const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);
  
  const handleOrderChange = (event) => {
    setOrder(event.target.value);
    setCurrentPage(1); // 정렬 순서 변경 시 첫 페이지로 이동
    setCursor(null); // 정렬 순서 변경 시 커서 초기화
  };

  /* 엔터키로 검색 입력 */
  const handleKeyDown = (e) =>{
    if(e.key === 'Enter'){
      handleSearchClick();
    }
  }

  const handleSearchChange = (event) => {
    setSearchProduct(event.target.value);
  };

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

  const handlePageClick = (page) => {
    setCurrentPage(page);
    handleLoad(page);
  };

  useEffect(() => {
    handleLoad(currentPage); // 초기 로드 및 페이지 변경 시 로드
  }, [order, currentPage]);

  // 최신순 좋아요 순 정렬
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
              onKeyDown={handleKeyDown}
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
        {loadingError && <span>{loadingError}</span>}
        <ProductList products={searchProduct ? searchResults : sortedProducts.slice((currentPage - 1) * LIMIT, currentPage * LIMIT)} />
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
