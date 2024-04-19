import React, { useState } from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { getSelectedChats } from '../../util/helper';
import { useChatContext } from '../../Context/ChatProvider';
import { getTime, getWeekDays } from '../../util/time';
import useLocalStorage from '../../hooks/useLocalStorage';

function AllUsers({ users, setUsers }) {
  const { handleSelectedChat, client, selectedChat } = useChatContext();
  const { getDataFromLocalStorage } = useLocalStorage();
  const loggedInUser = getDataFromLocalStorage('loggedInuser');
  const { subscribe, publish } = getSelectedChats(loggedInUser.id);
  const allUsers = users?.filter(us => us.id !== loggedInUser.id) || [];
  const [subscription, setSubscription] = useState(null);

  function startChat(user) {
    // Unsubscribe from previous subscription
    if (subscription) {
      subscription.unsubscribe();
    }

    const newSubscription = client.subscribe(subscribe, chat => {
      handleSelectedChat(JSON.parse(chat.body));
    });

    setSubscription(newSubscription);

    client &&
      client.publish({
        destination: publish,
        body: JSON.stringify({
          senderId: loggedInUser.id,
          recipientsId: [user.id, loggedInUser.id],
        }),
      });
  }

  return (
    <>
      {allUsers.length == 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Typography variant="h5">No Chats Found</Typography>
        </Box>
      ) : (
        allUsers.map((user, i) => (
          <Card
            key={user.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '0.5rem 0.5rem',
              cursor: 'pointer',
              background: 'linear-gradient(to right, #549554, #80ce7900)',
            }}
            onClick={() => startChat(user)}
          >
            <CardContent sx={{ display: 'flex', gap: '1rem' }}>
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
              <Box>
                <Typography
                  gutterBottom
                  variant="body2"
                  component="div"
                  style={{ fontWeight: 'bold' }}
                >
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.lastMessage?.message.substring(0, 20)}
                </Typography>
              </Box>
            </CardContent>
            <CardContent>
              <Typography gutterBottom variant="subtitle1" component="div">
                {getTime(user?.lastMessage?.createdAt)}
              </Typography>
              <Typography variant="caption">
                {' '}
                {getWeekDays(user?.lastMessage?.createdAt)}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
}

export default AllUsers;
