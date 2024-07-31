import { useState, useEffect, useCallback } from 'react';
import { getProductList } from '../api/api';

const LIMIT = 5;

function useProductList(order, initialCursor) {
  const [products, setProducts] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [cursor, setCursor] = useState(initialCursor);

  const fetchProducts = useCallback(async (page) => {
    try {
      setLoadingError(null);
      const response = await getProductList({ order, cursor, limit: LIMIT });
      const { paging, list, totalCount } = response;

      setProducts(list); // 전체 상품 목록 설정

      setCursor(paging ? paging.nextCursor : null);
      setHasNext(paging ? paging.hasNext : false);
      setTotalPages(totalCount ? Math.ceil(totalCount / LIMIT) : 5);
    } catch (error) {
      setLoadingError(error.message);
    }
  }, [order, cursor]);

  useEffect(() => {
    fetchProducts(1); // 초기 로드
  }, [order, cursor, fetchProducts]);

  return { products, hasNext, loadingError, totalPages, fetchProducts };
}

export default useProductList;
