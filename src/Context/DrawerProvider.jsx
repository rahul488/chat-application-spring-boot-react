import { createContext, useContext, useState } from 'react';

const DrawerContext = createContext(null);
export const useDrwaerContext = () => useContext(DrawerContext);

const DrawerProvider = ({ children }) => {
  const [isFriendListOpen, setFriendListScreen] = useState(false);

  function handleFriendDispaly() {
    setFriendListScreen(!isFriendListOpen);
  }

  return (
    <DrawerContext.Provider value={{ isFriendListOpen, handleFriendDispaly }}>
      {children}
    </DrawerContext.Provider>
  );
};
export default DrawerProvider;
