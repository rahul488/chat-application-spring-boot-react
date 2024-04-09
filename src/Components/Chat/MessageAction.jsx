import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { IconButton, TextField } from "@mui/material";
import { sendOrReceiveMessage } from "../../util/helper";
import { useChatContext } from "../../Context/ChatProvider";
import useLocalStorage from "../../hooks/useLocalStorage";

function MessageAction({ client = null, chatId, receipants = [] }) {
  const [inputVal, setInputVal] = useState("");
  const { selectedChat } = useChatContext();
  const { publish } = sendOrReceiveMessage(selectedChat?.id);
  const { getDataFromLocalStorage } = useLocalStorage();
  const user = getDataFromLocalStorage("loggedInuser");
  function handleChange(e) {
    setInputVal(e.target.value);
  }
  function sendMessage() {
    if (inputVal.length > 0) {
      const payload = {
        message: inputVal,
        senderId: user.id,
        chatId: chatId,
        recipientId: receipants.map((rec) => rec.id),
      };
      client &&
        client.publish({
          destination: publish,
          body: JSON.stringify(payload),
        });
      setInputVal("");
    }
  }
  return (
    <>
      <TextField
        value={inputVal}
        onChange={(e) => handleChange(e)}
        label="Enter your message"
        size="small"
        sx={{
          width: "80%",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#eee", // Change this to your desired border color
            },
            "&:hover fieldset": {
              borderColor: "white", // Border color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "white", // Border color when focused
            },
          },
          "& .MuiInputLabel-root": {
            color: "white !important", // Label color
          },
        }}
      />
      <IconButton onClick={sendMessage}>
        <SendIcon />
      </IconButton>
    </>
  );
}

export default MessageAction;
