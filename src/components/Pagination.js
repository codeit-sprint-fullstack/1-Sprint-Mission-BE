import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange, hasNext }) => {
    
  // 페이지 범위 계산
  const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);

  return (
    <div className="pagination">
      <div className='pageButtons'>
        <button 
          className="leftPageButton" 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <button 
            key={startPage + index}
            onClick={() => onPageChange(startPage + index)}
            className={startPage + index === currentPage ? 'active' : ''}
          >
            {startPage + index}
          </button>
        ))}
        <button 
          className='rightPageButton' 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={!hasNext || currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
