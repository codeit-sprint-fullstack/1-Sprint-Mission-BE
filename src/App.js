import React from 'react';
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
      </main>
    </div>
  );
}
export default App;
