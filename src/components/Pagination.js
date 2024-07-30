import React from 'react';

const Pagination = ({currentPage, totalPages}) => {
    
    // 페이지 범위 계산
    const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);
  
  return (
    <div className="pagination">
      <div className='pageButtons'>
        <button 
          className="leftPageButton" 
        >
          &lt;
        </button>
          <button>숫자
          </button>
        <button 
          className='rightPageButton' 
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
