import { useEffect, useState } from 'react';
import { useChatContext } from '../Context/ChatProvider';

const useScroll = (ref, totalPages, scrollDown = false) => {
  const [isFetching, setFetching] = useState(false);
  const [page, setPage] = useState(0);
  const { selectedChat } = useChatContext();

  function handleScroll() {
    if (page < totalPages && !isFetching) {
      if (!scrollDown && ref.current.scrollTop == 5) {
        ref.current.scrollTop = 200;
        setFetching(true);
        setPage(prev => prev + 1);
      } else if (
        scrollDown &&
        ref.current.scrollTop + ref.current.clientHeight >=
          ref.current.scrollHeight
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
