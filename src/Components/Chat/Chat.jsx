import React, { useRef } from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useChatContext } from "../../Context/ChatProvider";
import MessageAction from "./MessageAction";
import UserChats from "./UserChats";

function Chat() {
  const { client, selectedChat } = useChatContext();
  const chatContainerRef = useRef(null);

  return (
    <Box>
      {selectedChat ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "CaptionText",
              background: "#ff7e5f",
              background: "-webkit-linear-gradient(to right, #ff7e5f, #feb47b)",
              background: "linear-gradient(to right, #ff7e5f, #feb47b)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar alt="Rahul" src="./vite.svg" />
              <Typography variant="subtitle1">
                {selectedChat.groupName}
              </Typography>
            </Box>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              height: "500px",
              overflowY: "auto",
              p: 2,
              scrollBehavior: "smooth",
            }}
            ref={chatContainerRef}
          >
            {/* Chats data */}
            <UserChats ref={chatContainerRef} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <MessageAction
                client={client}
                chatId={selectedChat.id}
                receipants={selectedChat.users}
              />
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "500px",
          }}
        >
          <Typography
            sx={{
              textTransform: "uppercase",
              fontStyle: "italic",
              color: "Background",
            }}
          >
            Select user from sidebar to begin chat
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Chat;
