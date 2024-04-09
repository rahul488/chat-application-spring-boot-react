const useLocalStorage = () => {
  //TODO-Integrate redux for current user management

  function getDataFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  function setDataInLocalStorage(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  return { getDataFromLocalStorage, setDataInLocalStorage };
};
export default useLocalStorage;
