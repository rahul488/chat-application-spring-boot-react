import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

const ChatContext = createContext(null);
export const useChatContext = () => useContext(ChatContext);

function ChatProvider({ children }) {
  const [client, setClient] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectedChat = chat => {
    setSelectedChat(chat);
  };

  useEffect(() => {
    const currClient = new Client({
      brokerURL: 'ws://localhost:5000/server',
      onConnect: () => {
        setClient(currClient);
      },
    });
    currClient.activate();
    return () => currClient.deactivate();
  }, []);

  return (
    <ChatContext.Provider value={{ client, selectedChat, handleSelectedChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;
