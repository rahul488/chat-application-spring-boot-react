import React from 'react';
import { Box, IconButton } from '@mui/material';
import ChatSidebar from '../Components/Chat/Chats';
import Chat from '../Components/Chat/Chat';
import { useChatContext } from '../Context/ChatProvider';
import useScreenSize from '../hooks/useScreenSize';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Home() {
  const { selectedChat, handleSelectedChat } = useChatContext();
  const { isSmall, isExtraSmall } = useScreenSize();

  return (
    <Box
      sx={{
        display: 'flex',
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
              width: '500px',
            }}
          >
            <ChatSidebar />
          </Box>
          <Box
            sx={{
              padding: '1rem 1rem',
              width: '100%',
              border: '1px solid #f2efed',
            }}
          >
            <Chat />
          </Box>
        </>
      )}
    </Box>
  );
}

export default Home;
