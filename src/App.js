import React from 'react';
import searchIcon from './assets/images/ic_search.png';
import Header from './components/Header';
import BestProducts from './components/BestProducts';
import './App.css';

function App() {

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
              <select className="sortDropDown">
                <option value="createdAt">최신순</option>
                <option value="favoriteCount">좋아요순</option>
              </select>
          </div>
        </div>
      </main>
    </div>
  );
}
export default App;
