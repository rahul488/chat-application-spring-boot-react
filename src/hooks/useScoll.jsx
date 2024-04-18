import { useEffect, useState } from 'react';
import { useChatContext } from '../Context/ChatProvider';

const useScroll = (ref, totalPages, scrollDown = false) => {
  const [isFetching, setFetching] = useState(false);
  const [page, setPage] = useState(0);
  const { selectedChat } = useChatContext();

  function handleScroll() {
    if (
      !scrollDown &&
      ref.current.scrollTop == 5 &&
      page < totalPages &&
      !isFetching
    ) {
      ref.current.scrollTop = 200;
      setFetching(true);
      setPage(prev => prev + 1);
    } else {
      if (
        ref.current.innerHeight + ref.current.scrollTop >=
        ref.current.offsetHeight
      ) {
        setFetching(true);
        setPage(prev => prev + 1);
      }
    }
  }

  useEffect(() => {
    if (ref.current && page < totalPages) {
      const target = ref.current;
      target.addEventListener('scroll', handleScroll);
      return () => {
        target.removeEventListener('scroll', handleScroll);
      };
    }
  }, [ref, totalPages, page, isFetching, selectedChat?.id, scrollDown]);

  return { isFetching, setFetching, page, setPage };
};
export default useScroll;
