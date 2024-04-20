const useDebounce = delay => {
  let timeOut = null;
  function handleDebounce(value, cb) {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    timeOut = setTimeout(() => {
      cb(value);
    }, delay);
  }
  return handleDebounce;
};
export default useDebounce;
