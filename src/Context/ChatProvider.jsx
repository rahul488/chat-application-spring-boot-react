import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const ChatContext = createContext(null);
export const useChatContext = () => useContext(ChatContext);

function ChatProvider({ children }) {
  const [client, setClient] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectedChat = (chat) => {
    setSelectedChat(chat);
  }

  useEffect(() => {
    const currClient = new Client({
      brokerURL: "ws://friend-zone-chat.eu-north-1.elasticbeanstalk.com/server",
      onConnect: () => {
        setClient(currClient);
      },
    });
    currClient.activate();
    return () => currClient.deactivate();
  }, []);

  return (
    <ChatContext.Provider value={{ client, selectedChat, handleSelectedChat }}>{children}</ChatContext.Provider>
  );
}

export default ChatProvider;

  // useEffect(()=>{
  //   const client = new Client({
  //     brokerURL: 'ws://localhost:8080/server',
  //     onConnect: () => {
  //       client.subscribe('/topic/return-to', message =>
  //         console.log(`Received: ${message.body}`)
  //       );
  //       client.publish({ destination: '/app/message', body: JSON.stringify({
  //         message: 'hiii',
  //         name: 'rahul'
  //       })});
  //     },
  //   });
  //   client.activate();
  // },[])