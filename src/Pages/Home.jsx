import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ChatSidebar from '../Components/Chat/Chats';
import Chat from '../Components/Chat/Chat';
import { useChatContext } from '../Context/ChatProvider';
import useScreenSize from '../hooks/useScreenSize';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Friends from '../Components/Chat/Friends';
import { useDrwaerContext } from '../Context/DrawerProvider';

function Home() {
  const { selectedChat, handleSelectedChat } = useChatContext();
  const { isSmall, isExtraSmall } = useScreenSize();
  const { isFriendListOpen } = useDrwaerContext();

  return (
    <Box
      sx={{
        display: 'flex',
        // gap:'0.5rem',
        justifyContent: `${!isSmall && isFriendListOpen ? 'space-between' : ''}`,
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
      }}
      p={2}
    >
      {isSmall || isExtraSmall ? (
        selectedChat ? (
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
              width: '500px',
            }}
          >
            <ChatSidebar />
          </Box>
        )
      ) : (
        <>
          <Box
            sx={{
              width: '400px',
            }}
          >
            <ChatSidebar />
          </Box>
          <Box
            sx={{
              padding: '1rem 1rem',
              width: `${isFriendListOpen ? '500px' : '100%'}`,
              border: '1px solid #f2efed',
              transition: '0.3s ease-in-out',
            }}
          >
            <Chat />
          </Box>
          {isFriendListOpen ? (
            <Box
              sx={{
                width: `400px`,
                overflowY: 'auto',
                border: '1px solid #f2efed',
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
