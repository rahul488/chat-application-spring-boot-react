import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { useChatContext } from '../../Context/ChatProvider';
import {
  getAllFriends,
  sendOrReceiveMessage,
  updateMessageNotofication,
} from '../../util/helper';
import AllUsers from './AllUsers';
import useLocalStorage from '../../hooks/useLocalStorage';
import useScroll from '../../hooks/useScoll';
import useDebounce from '../../hooks/useDebounce';

function ChatSidebar() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const { client, selectedChat } = useChatContext();
  const { getDataFromLocalStorage } = useLocalStorage();
  const user = getDataFromLocalStorage('loggedInuser');
  const { subscribe, publish } = getAllFriends(user.id);
  const { subscribeLastMessage } = sendOrReceiveMessage();
  const { publish: updateMessageCount } = updateMessageNotofication();
  const [totalPages, setTotalPages] = useState(null);
  const sidebarRef = useRef(null);
  const { setFetching, page, setPage } = useScroll(
    sidebarRef,
    totalPages,
    true,
  );
  const handleDebounce = useDebounce(500);

  useEffect(() => {
    if (client) {
      const subscription = client.subscribe(subscribe, users => {
        const pageResponse = JSON.parse(users.body);
        setTotalPages(pageResponse.totalPages);
        setUsers(prev => [...prev, ...pageResponse.content]);
        setFetching(false);
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client, users]);

  /**Subscribe last message */
  useEffect(() => {
    if (client) {
      const subscribeLastMsg = client.subscribe(
        subscribeLastMessage + `/${user?.id}`,
        currUser => {
          const senderUser = JSON.parse(currUser.body);

          if (
            senderUser.chatId === selectedChat?.id &&
            senderUser.notificationResponse
          ) {
            client.publish({
              destination: updateMessageCount(
                senderUser.chatId,
                senderUser.notificationResponse.ownerId,
              ),
            });
          }

          const updatedUser = users.map(user => {
            if (user.chatId === senderUser.chatId) {
              const updatedUser = {
                ...user,
                ['lastMessage']: senderUser.lastMessage,
                ['notificationResponse']: senderUser.notificationResponse,
              };
              if (
                senderUser.chatId === selectedChat?.id &&
                senderUser.notificationResponse
              ) {
                updatedUser['notificationResponse'] = null;
              }
              return updatedUser;
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
  }, [client, users, selectedChat]);

  useEffect(() => {
    if (client) {
      client.publish({
        destination: publish,
        body: JSON.stringify({
          userId: user.id,
          pageNumber: page,
          query: searchQuery,
        }),
      });
    }
  }, [page, searchQuery, client]);

  function handleSearch(value) {
    handleDebounce(value.trim(), function (debounceValue) {
      if (debounceValue.length == 0) {
        setSearchQuery(null);
      } else {
        setSearchQuery(debounceValue);
      }
      setUsers([]);
      setPage(0);
    });
  }

  return (
    <>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: '0.5rem 2rem',
          }}
        >
          <TextField
            placeholder="Search your friends."
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
                borderRadius: '20px',
                transition: 'box-shadow 0.3s ease',
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)', // Adjust the shadow as needed
                },
              },
            }}
            onChange={e => handleSearch(e.target.value)}
            fullWidth
          />
        </Box>
        <Box
          sx={{ height: '550px', overflowY: 'auto', marginRight: '0.5rem' }}
          ref={sidebarRef}
        >
          <AllUsers users={users} />
        </Box>
      </Box>
    </>
  );
}

export default ChatSidebar;
