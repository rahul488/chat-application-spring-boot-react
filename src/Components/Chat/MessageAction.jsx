import React, { useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, TextField } from '@mui/material';
import { sendOrReceiveMessage } from '../../util/helper';
import { useChatContext } from '../../Context/ChatProvider';
import useLocalStorage from '../../hooks/useLocalStorage';

function MessageAction({ client = null, chatId, receipants = [] }) {
  const [inputVal, setInputVal] = useState('');
  const { selectedChat } = useChatContext();
  const { publish } = sendOrReceiveMessage(selectedChat?.id);
  const [errorMessage, setErrorMessage] = useState('');
  const { getDataFromLocalStorage } = useLocalStorage();
  const user = getDataFromLocalStorage('loggedInuser');
  function handleChange(e) {
    setErrorMessage('');
    setInputVal(e.target.value);
  }
  function sendMessage() {
    if (inputVal.trim().length == 0) {
      setErrorMessage('Please enter message');
    } else if (inputVal.length > 0) {
      const payload = {
        message: inputVal.trim(),
        senderId: user.id,
        chatId: chatId,
        pageNumber: 0,
        recipientId: receipants.map(rec => rec.id),
      };
      client &&
        client.publish({
          destination: publish,
          body: JSON.stringify(payload),
        });
      setInputVal('');
    }
  }
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      sendMessage(event);
    }
  };

  return (
    <>
      <TextField
        value={inputVal}
        onChange={e => handleChange(e)}
        onKeyDown={handleKeyDown}
        label="Enter your message"
        size="small"
        error={errorMessage.length ? true : false}
        helperText={errorMessage?.length ? errorMessage : ''}
        sx={{
          width: '80%',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#eee', // Change this to your desired border color
            },
            '&:hover fieldset': {
              borderColor: 'white', // Border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white', // Border color when focused
            },
          },
          '& .MuiInputLabel-root': {
            color: 'white !important', // Label color
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
