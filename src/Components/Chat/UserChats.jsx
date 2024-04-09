import React, { forwardRef, useEffect, useState } from "react";
import { useChatContext } from "../../Context/ChatProvider";
import { getMessages, sendOrReceiveMessage } from "../../util/helper";
import { Box, Typography, Avatar } from "@mui/material";
import { getTime, getWeekDays } from "../../util/time";
import useLocalStorage from "../../hooks/useLocalStorage";
import useScroll from "../../hooks/useScoll";

const UserChats = forwardRef((props, ref) => {
  const [messages, setMessage] = useState([]);
  const { client, selectedChat } = useChatContext();
  const { subscribe } = sendOrReceiveMessage(selectedChat?.id);
  const { subscribe: subscribeAllMessage, publish: getAlllMessages } =
    getMessages();
  const { getDataFromLocalStorage } = useLocalStorage();
  const { isFetching, setFetching } = useScroll(ref);

  const scrollToBottom = () => {
    if (ref?.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //TODO:get current user
  const user = getDataFromLocalStorage("loggedInuser");
  useEffect(() => {
    if (client) {
      client.publish({
        destination: getAlllMessages,
        body: JSON.stringify({ chatId: selectedChat?.id }),
      });
      const subscribed = client.subscribe(subscribeAllMessage, (message) => {
        setMessage(JSON.parse(message.body));
      });
      return () => {
        client.unsubscribe(subscribed);
      };
    }
  }, [client, selectedChat]);
  useEffect(() => {
    if (client) {
      const subscribed = client.subscribe(subscribe, (chat) => {
        setMessage(JSON.parse(chat.body));
      });
      return () => {
        client.unsubscribe(subscribed);
      };
    }
  }, [client, subscribe]);

  const getBackground = (senderId) => {
    if (senderId == user.id) {
      return {
        // width: "200px",
        height: "40px",
        background: "#ff7e5f",
        background: "-webkit-linear-gradient(to right, #ff7e5f, #feb47b)",
        background: "linear-gradient(to right, #ff7e5f, #feb47b)",
        flexWrap: "wrap",
        display: "flex",
        alignItems: "center",
        borderRadius: "40px",
        padding: "0.5rem 0.5rem",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      };
    } else {
      return {
        // width: "200px",
        height: "40px",
        background: "#00b09b ",
        background: "-webkit-linear-gradient(to right, #96c93d, #00b09b)",
        background: "linear-gradient(to right, #96c93d, #00b09b)",
        flexWrap: "wrap",
        display: "flex",
        alignItems: "center",
        borderRadius: "40px",
        padding: "0.5rem 0.5rem",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      };
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {user &&
        messages.map((message, index) => {
          const currentDay = getWeekDays(message.createdAt);
          const previousDay =
            index > 0 ? getWeekDays(messages[index - 1].createdAt) : null;
          const showDayName = previousDay !== currentDay;

          return (
            <>
              {showDayName && (
                <Typography
                  variant="subtitle2"
                  sx={{fontWeight:'bold'}}
                  textAlign={"center"}
                  key={index}
                >
                  {currentDay}
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: `${
                    message.senderId === user.id ? "flex-end" : "flex-start"
                  }`,
                  width: "100%",
                }}
                gap="0.5rem"
                key={message.id}
              >
                {message.senderId !== user.id ? (
                  <Avatar
                    alt="Rahul"
                    src="./vite.svg"
                    sx={{
                      height: "40px",
                      width: "40px",
                      borderRadius: "40px",
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    }}
                  />
                ) : null}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <Box sx={getBackground(message.senderId)}>
                    <Typography ml={1}>{message.message}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      margin: "0 0.5rem",
                      justifyContent: `${
                        message.senderId === user.id ? "flex-end" : "flex-start"
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
                      height: "40px",
                      width: "40px",
                      borderRadius: "40px",
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    }}
                  />
                ) : null}
              </Box>
            </>
          );
        })}
    </Box>
  );
});

export default UserChats;
