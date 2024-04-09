package com.friendify.ChatService.Service;

import com.friendify.ChatService.Dto.Conversion;
import com.friendify.ChatService.Dto.MessageRequestDTO;
import com.friendify.ChatService.Dto.MessageResponseDTO;
import com.friendify.ChatService.Dto.UserResponse;
import com.friendify.ChatService.Entity.Chat;
import com.friendify.ChatService.Entity.Messages;
import com.friendify.ChatService.Entity.User;
import com.friendify.ChatService.Exception.CommonException;
import com.friendify.ChatService.Exception.UserNotFoundException;
import com.friendify.ChatService.Repo.ChatRepo;
import com.friendify.ChatService.Repo.MessageRepo;
import com.friendify.ChatService.Repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ChatRepo chatRepo;

    @Autowired
    private MessageRepo messageRepo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void sendMessage(MessageRequestDTO message){
        User senderUser = userRepo.findById(message.getSenderId()).orElse(null);
        Chat chat = chatRepo.findById(message.getChatId()).orElse(null);
        if(senderUser == null ) throw new UserNotFoundException("User not found");
        if(chat == null) throw new CommonException("Chat does not exist between/among the users");
        MessageResponseDTO messageResponse = new MessageResponseDTO();
        messageResponse.setMessage(message.getMessage());
        messageResponse.setSender(senderUser);
        //set chat on db
        Messages messages = Messages.builder().message(message.getMessage()).chat(chat).senderId(message.getSenderId()).createdAt(new Date()).build();
        chat.getMessages().add(messages);
        chatRepo.save(chat);
        List<Messages> messagesInAsc =  messageRepo.findByChatId(chat.getId());
        messagingTemplate.convertAndSend("/topic/receive/"+message.getChatId(), messagesInAsc);
        getAllUsers(messages.getSenderId());
    }

    @Transactional
    public void getAllUsers(int userId){
        List<User> users = userRepo.findAll();
        List<UserResponse> userResponses = new ArrayList<>();
            for(User user:users) {
                if (user.getId() != userId) {
                    Chat chat = chatRepo.findChatByUsers(Arrays.asList(userId, user.getId()));
                    Messages lastMessage = messageRepo.findLastChatMessages(chat.getId());
                    UserResponse userResponse = new UserResponse();
                    userResponse.setLastMessage(lastMessage);
                    userResponse.setId(user.getId());
                    userResponse.setName(user.getName());
                    userResponses.add(userResponse);
                }
            }
            messagingTemplate.convertAndSend("/topic/users",userResponses);
    }

    @Transactional
    public void startNewConversion(Conversion conversion){
        User senderUser = userRepo.findById(conversion.getSenderId()).orElse(null);
        if(senderUser == null) throw new UserNotFoundException("user not found");
        Set<User> users = conversion.getRecipientsId()
                .stream().map((rec) -> userRepo.findById(rec).orElse(null))
                .collect(Collectors.toSet());
        Chat chat =null;

       Chat isChatExist = chatRepo.findChatByUsers(conversion.getRecipientsId());
       String groupName = users.stream().filter((user) -> user.getId() != conversion.getSenderId()).map((user) -> user.getName()).collect(Collectors.joining(",")).toString();
       if(isChatExist != null) {
           /**
            *
            *  NOTE-Group name will automatically save in db as this method is annotated
            *       with @Transactional we don't need to explicitly do save method.
            * **/
           isChatExist.setGroupName(groupName);
           chat=isChatExist;
       }
       else{
           chat = new Chat();
           chat.setUsers(users);
           chat.setGroupName(groupName);
           senderUser.getChats().add(chat);
           chatRepo.save(chat);
       }

        messagingTemplate.convertAndSend("/topic/start-chat", chat);
    }

    public void getAllMessagesByChatId(int chatId){
       List<Messages> messages =  messageRepo.findByChatId(chatId);
       messagingTemplate.convertAndSend("/topic/all-messages",messages);
    }
}
