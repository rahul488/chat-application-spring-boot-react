import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useChatContext } from '../../Context/ChatProvider';
import { getMessages, sendOrReceiveMessage } from '../../util/helper';
import { Box, Typography, Avatar } from '@mui/material';
import { getTime, getWeekDays } from '../../util/time';
import useLocalStorage from '../../hooks/useLocalStorage';
import useScroll from '../../hooks/useScoll';
import useScreenSize from '../../hooks/useScreenSize';

const UserChats = forwardRef((props, ref) => {
  const [messages, setMessage] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const { client, selectedChat } = useChatContext();
  const [isMessageSend, setMessageSend] = useState(false);
  const isMouted = useRef(true);
  const { subscribe } = sendOrReceiveMessage(selectedChat?.id);
  const { getDataFromLocalStorage } = useLocalStorage();
  const { setFetching, page, setPage } = useScroll(ref, totalPages);
  const { isSmall, isExtraSmall } = useScreenSize();
  //TODO:get current user
  const user = getDataFromLocalStorage('loggedInuser');
  const { subscribe: subscribeAllMessage, publish: getAlllMessages } =
    getMessages(selectedChat?.id, user?.id);

  const scrollToBottom = () => {
    if (ref?.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  /** scroll to bottom when new message send */
  useEffect(() => {
    if (isMessageSend || (isMouted.current && messages.length)) {
      scrollToBottom();
      isMouted.current = false;
    }
  }, [messages, isMessageSend, isMouted.current]);

  useEffect(() => {
    if (client) {
      setPage(0);
      setMessage([]);
      setMessageSend(false);
      isMouted.current = true;
      client.publish({
        destination: getAlllMessages,
        body: JSON.stringify({
          chatId: selectedChat?.id,
          pageNumber: 0,
          senderId: user.id,
        }),
      });
      const subscribeAllMessages = client.subscribe(
        subscribeAllMessage,
        message => {
          const currentPage = JSON.parse(message.body);
          setTotalPages(currentPage.totalPages);
          setMessage(prev => {
            return [...currentPage.content, ...prev];
          });
          setMessageSend(false);
          setFetching(false);
        },
      );
      const subscribeLastMessage = client.subscribe(subscribe, chat => {
        const lastMessage = JSON.parse(chat.body);
        setMessage(prev => {
          let updatedMessages = [...prev, lastMessage];
          const slicedMessages = [...prev, lastMessage].slice(
            updatedMessages.length - 10,
            updatedMessages.length,
          );
          return updatedMessages.length > 10 ? slicedMessages : updatedMessages;
        });
        setMessageSend(true);
        setPage(0);
      });
      return () => {
        subscribeAllMessages.unsubscribe();
        subscribeLastMessage.unsubscribe();
      };
    }
  }, [client, selectedChat?.id]);

  /**For getting older message */
  // useEffect(() => {
  //   if (page > 0) {
  //     client.publish({
  //       destination: getAlllMessages,
  //       body: JSON.stringify({ chatId: selectedChat?.id, pageNumber: page }),
  //     });
  //   }

  // }, [page, selectedChat?.id]);

  const getBackground = senderId => {
    if (senderId == user.id) {
      return {
        height: 'auto',
        maxWidth: `${isSmall || isExtraSmall ? '200px' : '350px'}`,
        background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
        flexWrap: 'wrap',
        borderRadius: '40px',
        wordWrap: 'break-word',
        padding: '0.5rem 0.5rem',
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
      };
    } else {
      return {
        height: 'auto',
        maxWidth: `${isSmall || isExtraSmall ? '200px' : '350px'}`,
        background: 'linear-gradient(to right, #96c93d, #00b09b)',
        wordWrap: 'break-word',
        borderRadius: '40px',
        padding: '0.5rem 0.5rem',
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
      };
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {user &&
        messages.map((message, index) => {
          const currentDay = getWeekDays(message.createdAt);
          const previousDay =
            index > 0 ? getWeekDays(messages[index - 1].createdAt) : null;
          const showDayName = previousDay !== currentDay;

          return (
            <Box key={message.id}>
              {showDayName && (
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 'bold' }}
                  textAlign={'center'}
                >
                  {currentDay}
                </Typography>
              )}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: `${
                    message.senderId === user.id ? 'flex-end' : 'flex-start'
                  }`,
                  width: '100%',
                }}
                gap="0.5rem"
              >
                {message.senderId !== user.id ? (
                  <Avatar
                    alt="Rahul"
                    src="./vite.svg"
                    sx={{
                      height: '40px',
                      width: '40px',
                      borderRadius: '40px',
                      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                    }}
                  />
                ) : null}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <Box sx={getBackground(message.senderId)}>
                    <Typography ml={1}>{message.message}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      margin: '0 0.5rem',
                      justifyContent: `${
                        message.senderId === user.id ? 'flex-end' : 'flex-start'
                      }`,
                    }}
                  >
                    <Typography variant="subtitle2">
                      {getTime(message.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                {message.senderId === user.id ? (
                  <Avatar
                    alt="Rahul"
                    src="./vite.svg"
                    sx={{
                      height: '40px',
                      width: '40px',
                      borderRadius: '40px',
                      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                    }}
                  />
                ) : null}
              </Box>
            </Box>
          );
        })}
    </Box>
  );
});

export default UserChats;
