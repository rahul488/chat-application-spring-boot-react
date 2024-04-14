import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useChatContext } from '../../Context/ChatProvider';
import { getUsers } from '../../util/helper';
import AllUsers from './AllUsers';
import useLocalStorage from '../../hooks/useLocalStorage';

function ChatSidebar() {
  const [users, setUsers] = useState([]);
  const { client } = useChatContext();
  const { getDataFromLocalStorage } = useLocalStorage();
  const user = getDataFromLocalStorage('loggedInuser');
  const { subscribe, publish } = getUsers(user.id);

  useEffect(() => {
    if (client) {
      client.publish({
        destination: publish,
      });
      const subscription = client.subscribe(subscribe, users =>
        setUsers(JSON.parse(users.body)),
      );
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client]);

  return (
    <Box sx={{ height: '620px', overflowY: 'auto', marginRight: '0.5rem' }}>
      <AllUsers users={users} />
    </Box>
  );
}

export default ChatSidebar;
