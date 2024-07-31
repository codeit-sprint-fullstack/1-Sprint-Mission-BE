import { useState, useEffect } from 'react';
import { getProductList } from '../api/api';

const LIMIT = 5;

function useProductList(order, Cursor) {
  const [products, setProducts] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [cursor, setCursor] = useState(Cursor);
  const [currentPageProducts, setCurrentPageProducts] = useState([]);

  const fetchProducts = async (page) => {
    try {
      setLoadingError(null);
      const response = await getProductList({ order, cursor, limit: LIMIT });
      const { paging, list, totalCount } = response; 

      if (page === 1) {
        setProducts(list);
      } else {
        const startIndex = (page - 1) * LIMIT;
        const endIndex = page * LIMIT;
        setCurrentPageProducts(products.slice(startIndex, endIndex));
      }

      setCursor(paging ? paging.nextCursor : null);
      setHasNext(paging ? paging.hasNext : false);
      setTotalPages(totalCount ? Math.ceil(totalCount / LIMIT) : 5);
    } catch (error) {
      setLoadingError(error.message);
    }
  };

  useEffect(() => {
    fetchProducts(1); // 초기 로드
  }, [order, cursor]);

  return { products, hasNext, loadingError, totalPages, fetchProducts };
}

export default useProductList;
