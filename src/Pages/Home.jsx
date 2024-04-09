import React from "react";
import { Box } from "@mui/material";
import ChatSidebar from "../Components/Chat/Chats";
import Chat from "../Components/Chat/Chat";

function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
      }}
      p={2}
    >
      <Box
        sx={{
          width: "500px",
        }}
      >
        <ChatSidebar />
      </Box>
      <Box
        sx={{
          padding: "1rem 1rem",
          width: "100%",
          border: "1px solid #f2efed",
        }}
      >
        <Chat />
      </Box>
    </Box>
  );
}

export default Home;
