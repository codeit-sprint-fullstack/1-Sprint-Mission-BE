import React from 'react';

const Pagination = () => {
    
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
