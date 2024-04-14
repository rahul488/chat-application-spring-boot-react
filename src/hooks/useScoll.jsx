import { useEffect, useState } from 'react';

const useScroll = (ref, totalPages) => {
  const [isFetching, setFetching] = useState(false);
  const [page, setPage] = useState(0);

  function handleScroll() {
    if (ref.current.scrollTop == 0 && page <= totalPages - 1 && !isFetching) {
      ref.current.scrollTop = 200;
      setFetching(true);
      setPage(prev => prev + 1);
    }
  }

  useEffect(() => {
    if (ref.current && page <= totalPages - 1) {
      const target = ref.current;
      target.addEventListener('scroll', handleScroll);
      return () => {
        target.removeEventListener('scroll', handleScroll);
      };
    }
  }, [ref, totalPages, page, isFetching]);

  return { isFetching, setFetching, page, setPage };
};
export default useScroll;
