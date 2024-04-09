import { useEffect, useState } from "react";

const useScroll = (ref, isLast) => {
  const [isFetching, setFetching] = useState(false);
  const [page, setPage] = useState(0);
  function handleScroll() {
    if (ref.current.scrollTop == 0 && !isLast && !isFetching) {
      setFetching(true);
      setPage((prev) => prev + 1);
    }
  }

  useEffect(() => {
    if (ref.current && !isLast) {
      const target = ref.current;
      target.addEventListener("scroll", handleScroll);

      return () => target.removeEventListener("scroll", handleScroll);
    }
  }, [ref, isLast]);
  return { isFetching, setFetching, page };
};
export default useScroll;
