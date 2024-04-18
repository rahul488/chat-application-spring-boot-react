import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useChatContext } from '../../Context/ChatProvider';
import { getAllFriends, sendOrReceiveMessage } from '../../util/helper';
import AllUsers from './AllUsers';
import useLocalStorage from '../../hooks/useLocalStorage';

function ChatSidebar() {
  const [users, setUsers] = useState([]);
  const { client } = useChatContext();
  const { getDataFromLocalStorage } = useLocalStorage();
  const user = getDataFromLocalStorage('loggedInuser');
  const { subscribe, publish } = getAllFriends(user.id);
  const { subscribeLastMessage } = sendOrReceiveMessage();

  useEffect(() => {
    if (client) {
      client.publish({
        destination: publish,
        body: JSON.stringify({
          userId: user.id,
          pageNumber: 0,
        }),
      });
      const subscription = client.subscribe(subscribe, users => {
        const pageResponse = JSON.parse(users.body);
        setUsers(pageResponse.content || []);
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client]);

  useEffect(() => {
    if (client) {
      const subscribeLastMsg = client.subscribe(
        subscribeLastMessage + `/${user.id}`,
        msg => {
          const message = JSON.parse(msg.body);
          const updatedUser = users.map(user => {
            if (user.chatId === message.chatId) {
              return { ...user, ['lastMessage']: message.lastMessage };
            } else {
              return user;
            }
          });
          setUsers(updatedUser);
        },
      );
      return () => {
        subscribeLastMsg.unsubscribe();
      };
    }
  }, [client, users]);

  return (
    <Box sx={{ height: '620px', overflowY: 'auto', marginRight: '0.5rem' }}>
      <AllUsers users={users} />
    </Box>
  );
}

export default ChatSidebar;
