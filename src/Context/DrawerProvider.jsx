import { createContext, useContext, useState } from 'react';

const DrawerContext = createContext(null);
export const useDrwaerContext = () => useContext(DrawerContext);

const DrawerProvider = ({ children }) => {
  const [isFriendListOpen, setFriendListScreen] = useState(false);
  const [notificationCount, setNotificationCpunt] = useState(0);

  function handleFriendDispaly() {
    setFriendListScreen(!isFriendListOpen);
  }
  function handleNotificationCount(count) {
    setNotificationCpunt(count);
  }

  return (
    <DrawerContext.Provider
      value={{
        isFriendListOpen,
        handleFriendDispaly,
        handleNotificationCount,
        notificationCount,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
export default DrawerProvider;
