import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import {
  acceptFriendRequest,
  getFriendRequests,
  getFriendRequestsNotification,
  getUsers,
  sentFriendRequest,
} from '../../util/helper';
import { useChatContext } from '../../Context/ChatProvider';
import useLocalStorage from '../../hooks/useLocalStorage';
import useScroll from '../../hooks/useScoll';

function Friends() {
  const [people, setpeople] = useState([]);
  const [subscribeChannel, setSubscribeChannel] = useState(null);
  const [isFriendRequestList, setIsFriendReuqestList] = useState(false);
  const { client } = useChatContext();
  const { getDataFromLocalStorage } = useLocalStorage();
  const user = getDataFromLocalStorage('loggedInuser');
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [totalPages, setTotalPages] = useState(null);
  const firendListRef = useRef(null);
  const { setFetching, page, setPage } = useScroll(
    firendListRef,
    totalPages,
    true,
  );
  const { subscribe, publish } = getUsers(user.id);
  const { publish: sentRequest, subscribe: getAcknowledge } = sentFriendRequest(
    user.id,
  );

  const {
    publish: callFriendRequestList,
    subscribe: subscribeFriendRequestList,
    getLastFriendRequest,
  } = getFriendRequests(user.id);
  const {
    subscribe: getFriendrequestCount,
    publish: callFriendRequestNotification,
  } = getFriendRequestsNotification(user.id);

  const { publish: acceptRequest, subscribe: subscribeUpdatedRequest } =
    acceptFriendRequest();

  useEffect(() => {
    getAllFriends();
    if (client) {
      client.publish({
        destination: callFriendRequestNotification,
      });
      const notificstionSubscriber = client.subscribe(
        getFriendrequestCount,
        count => {
          setFriendRequestCount(+count.body);
        },
      );
      //update pending friend request on recevier site
      const receiverSubscriber = client.subscribe(
        getLastFriendRequest,
        user => {
          const updatedUser = JSON.parse(user.body);
          setpeople(prev => [updatedUser, ...prev]);
        },
      );

      return () => {
        notificstionSubscriber.unsubscribe();
        receiverSubscriber.unsubscribe();
      };
    }
  }, [client]);

  useEffect(() => {
    if (client) {
      const subscription = client.subscribe(subscribe, users => {
        const pageResponse = JSON.parse(users.body);
        setTotalPages(pageResponse.totalPages);
       if(page == 0){
          setpeople(pageResponse.content);
       }else{
        setpeople(prev => [...prev, ...pageResponse.content]);
       }
        setFetching(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client, people, page]);

  useEffect(() => {
    if (client && !isFriendRequestList) {
      client.publish({
        destination: publish,
        body: JSON.stringify({
          userId: user.id,
          pageNumber: page,
        }),
      });
    }
  }, [page, client, isFriendRequestList]);

  function handleSentRequest(friendId) {
    if (subscribeChannel) {
      subscribeChannel.unsubscribe();
    }
    if (client) {
      client.publish({
        destination: sentRequest,
        body: JSON.stringify({
          userId: user.id,
          friendId: friendId,
        }),
      });
      const senderSubscription = client.subscribe(
        getAcknowledge(user.id),
        user => {
          const updatedUser = JSON.parse(user.body);
          const updatedPeople = people.map(user => {
            if (user.id === updatedUser.id) {
              return { ...user, ...updatedUser };
            } else {
              return { ...user };
            }
          });
          setpeople(updatedPeople);
        },
      );
      setSubscribeChannel(senderSubscription);
    }
  }

  function getPendingRequests() {
    if (subscribeChannel) {
      subscribeChannel.unsubscribe();
    }
    if (client) {
      client.publish({
        destination: callFriendRequestList,
      });

      const subscribe = client.subscribe(
        subscribeFriendRequestList,
        requests => {
          const response = JSON.parse(requests.body);
          setpeople(response);
        },
      );
      setSubscribeChannel(subscribe);
      setIsFriendReuqestList(true);
    }
  }
  function getAllFriends() {
    setPage(0);
    setIsFriendReuqestList(false);
  }

  function acceptPendingFriendRequest(friendId) {
    if (subscribeChannel) {
      subscribeChannel.unsubscribe();
    }
    if (client) {
      client.publish({
        destination: acceptRequest(friendId),
      });
      const subscription = client.subscribe(
        subscribeUpdatedRequest(friendId),
        request => {
          const response = JSON.parse(request.body);
          const updatedPeople = people.map(friend => {
            if (friend.id === response.id) {
              return { ...friend, ...response };
            } else {
              return { ...friend };
            }
          });
          setpeople(updatedPeople);
        },
      );
      setSubscribeChannel(subscription);
    }
  }

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }} ref={firendListRef}>
      <Box p={2} sx={{ display: 'flex', gap: '0.5rem' }}>
        <Chip
          variant="filled"
          color="success"
          label="Add Friend"
          sx={{ cursor: 'pointer' }}
          onClick={getAllFriends}
        />
        <Badge badgeContent={friendRequestCount} color="warning">
          <Chip
            label="Friend Requests"
            variant="filled"
            color="secondary"
            sx={{ cursor: 'pointer' }}
            onClick={getPendingRequests}
          />
        </Badge>
      </Box>
      {people.length == 0 ? (
        <Box sx={{ height: '300px', marginTop: '50%' }}>
          <Typography variant="h5" textAlign="center">
            {isFriendRequestList ? 'No Request Found ' : 'No Friends Found'}
          </Typography>
        </Box>
      ) : (
        people.map(currUser => (
          <Card
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '0.5rem 0.5rem',
              padding: '0.5rem 0.5rem',
              alignItems: 'center',
            }}
            key={currUser.id}
            className="friends-card"
          >
            <Avatar
              alt={`${currUser.name}`}
              src="./"
              sx={{
                height: '40px',
                width: '40px',
                background:'green',
                borderRadius: '40px',
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
              }}
            />
            <CardContent>
              <Typography variant="h6" component="div">
                {currUser.name}
              </Typography>
              <Typography variant="body2">One mutual friend</Typography>
              <Box mt={2}>
                {isFriendRequestList ? (
                  <Button
                    color="warning"
                    variant="contained"
                    disabled={currUser.friend || false}
                    onClick={() => acceptPendingFriendRequest(currUser.id)}
                  >
                    {currUser?.friend ? 'Accepted' : 'Accept'}
                  </Button>
                ) : (
                  <Button
                    color="success"
                    variant="contained"
                    disabled={currUser.friend || false}
                    onClick={() => handleSentRequest(currUser.id)}
                  >
                    {currUser?.friend ? 'Requested' : 'Add Friend'}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

export default Friends;
