import React, { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ChatSidebar from '../Components/Chat/Chats';
import Chat from '../Components/Chat/Chat';
import { useChatContext } from '../Context/ChatProvider';
import useScreenSize from '../hooks/useScreenSize';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Friends from '../Components/Chat/Friends';
import { useDrwaerContext } from '../Context/DrawerProvider';
import { getFriendRequestsNotification } from '../util/helper';
import useLocalStorage from '../hooks/useLocalStorage';

function Home() {
  const { selectedChat, handleSelectedChat, client } = useChatContext();
  const { isSmall, isExtraSmall } = useScreenSize();
  const { isFriendListOpen, handleNotificationCount } = useDrwaerContext();
  const { getDataFromLocalStorage } = useLocalStorage();
  const user = getDataFromLocalStorage('loggedInuser');

  const {
    subscribe: getFriendrequestCount,
    publish: callFriendRequestNotification,
  } = getFriendRequestsNotification(user.id);

  useEffect(() => {
    if (client) {
      client.publish({
        destination: callFriendRequestNotification,
      });
      const notificationSubscriber = client.subscribe(
        getFriendrequestCount,
        count => {
          handleNotificationCount(+count.body);
        },
      );

      return () => notificationSubscriber.unsubscribe();
    }
  }, [client]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: `${!isSmall && isFriendListOpen ? 'space-between' : ''}`,
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
      }}
      p={2}
    >
      {isSmall || isExtraSmall ? (
        isFriendListOpen ? (
          <Box
            sx={{
              width: `400px`,
              overflowY: 'auto',
              height: '620px',
              boxShadow: 'rgba(0, 0, 0, 0) 0px 5px 15px',
            }}
          >
            <Friends />
          </Box>
        ) : selectedChat ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              width: '100%',
            }}
          >
            <IconButton
              sx={{ justifyContent: 'flex-end' }}
              onClick={() => handleSelectedChat(null)}
            >
              <ArrowBackIcon fontSize="medium" />
            </IconButton>
            <Box
              sx={{
                padding: '1rem 1rem',
                width: '100%',
                border: '1px solid #f2efed',
              }}
            >
              <Chat />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '620px',
              overflowY: 'auto',
            }}
          >
            <ChatSidebar />
          </Box>
        )
      ) : (
        <>
          <Box
            sx={{
              width: '500px',
            }}
          >
            <ChatSidebar />
          </Box>
          <Box
            sx={{
              padding: '1rem 1rem',
              width: `${isFriendListOpen ? '60%' : '100%'}`,
              border: '1px solid #f2efed',
              transition: '0.3s smooth',
            }}
          >
            <Chat />
          </Box>
          {isFriendListOpen ? (
            <Box
              sx={{
                width: `40%`,
                height: '620px',
                marginLeft: '0.5rem',
                overflowY: 'auto',
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
              }}
            >
              <Friends />
            </Box>
          ) : null}
        </>
      )}
    </Box>
  );
}

export default Home;
