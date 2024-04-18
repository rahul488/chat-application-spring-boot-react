export const getUsers = currUserId => ({
  publish: '/app/users',
  subscribe: '/topic/users/' + currUserId,
});
export const getSelectedChats = userId => ({
  publish: '/app/user/chat',
  subscribe: '/topic/start-chat/' + userId,
});
export const sendOrReceiveMessage = chatId => ({
  publish: '/app/message/send',
  subscribe: `/topic/receive/${chatId}`,
  subscribeLastMessage: '/topic/update-last-message',
});
export const getMessages = chatId => ({
  publish: `/app/user/messages`,
  subscribe: `/topic/all-messages/` + chatId,
});
export const getAllFriends = userId => ({
  publish: `/app/user/get-friends`,
  subscribe: `/topic/get-friend-list/` + userId,
});

export const sentFriendRequest = userId => ({
  // publish: (friendId) =>`/app/user/add-friend`,
  publish: `/app/user/add-friend`,
  subscribe: `/topic/request-status/${userId}`,
});

export const acceptFriendRequest = () => ({
  publish: friendShipId => `/app/user/accept-friend-request/${friendShipId}`,
  subscribe: friendShipId => `/topic/update-friend-request/${friendShipId}`,
});

export const getFriendRequests = userId => ({
  publish: `/app/user/get-friend-request/${userId}`,
  subscribe: `/topic/get-friend-request-list/${userId}`,
});

//user related APIS
// const BASEURL = "http://friend-chat-env.eba-btq4zkth.eu-north-1.elasticbeanstalk.com/"
const BASEURL = 'http://localhost:5000/';
export const CREATE_USER = BASEURL + 'signup';
export const LOGIN_USER = BASEURL + 'login';
