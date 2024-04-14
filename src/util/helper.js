export const getUsers = userId => ({
  publish: '/app/users/' + userId,
  subscribe: '/topic/users',
});
export const getSelectedChats = () => ({
  publish: '/app/user/chat',
  subscribe: '/topic/start-chat',
});
export const sendOrReceiveMessage = chatId => ({
  publish: '/app/message/send',
  subscribe: `/topic/receive/${chatId}`,
});
export const getMessages = () => ({
  publish: `/app/user/messages`,
  subscribe: `/topic/all-messages`,
});
//user related APIS
// const BASEURL = "http://friend-chat-env.eba-btq4zkth.eu-north-1.elasticbeanstalk.com/"
const BASEURL = 'http://localhost:5000/';
export const CREATE_USER = BASEURL + 'signup';
export const LOGIN_USER = BASEURL + 'login';
