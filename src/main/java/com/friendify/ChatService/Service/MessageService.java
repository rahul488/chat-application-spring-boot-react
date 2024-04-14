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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
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
        messages.setChat(chat);
        messageRepo.save(messages);
        messagingTemplate.convertAndSend("/topic/receive/"+message.getChatId(), messages);
        getAllUsers(messages.getSenderId());
    }

//    @Async("asyncTaskExecutor")
//    public void saveMessageOnDB(Messages message, int chatId){
//        User senderUser = userRepo.findById(message.getSenderId()).orElse(null);
//        Chat chat = chatRepo.findById(chatId).orElse(null);
//        if(senderUser == null ) throw new UserNotFoundException("User not found");
//        if(chat == null) throw new CommonException("Chat does not exist between/among the users");
//        //set chat on db
//        chat.getMessages().add(message);
//        chatRepo.save(chat);
//        getAllUsers(message.getSenderId());
//    }

    @Transactional
    public void getAllUsers(int userId){
        List<User> users = userRepo.findAll();
        List<UserResponse> userResponses = new ArrayList<>();
            for(User user:users) {
                if (user.getId() != userId) {
                    Chat chat = chatRepo.findChatByUsers(Arrays.asList(userId, user.getId()),2);
                    Messages lastMessage;
                    if(chat == null) {
                        lastMessage = null;
                    }else{
                        lastMessage = messageRepo.findLastChatMessages(chat.getId());
                    }
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
    public void startConversion(Conversion conversion){
        User senderUser = userRepo.findById(conversion.getSenderId()).orElse(null);
        if(senderUser == null) throw new UserNotFoundException("user not found");
        Set<User> users = conversion.getRecipientsId()
                .stream().map((rec) -> userRepo.findById(rec).orElse(null))
                .collect(Collectors.toSet());
        Chat chat =null;
        Chat isChatExist = chatRepo.findChatByUsers(conversion.getRecipientsId(),conversion.getRecipientsId().size());
        String groupName = users
                .stream()
                .filter((user) -> user.getId() != conversion.getSenderId())
                .map((user) -> user.getName())
                .collect(Collectors.joining(","))
                .toString();
        if(isChatExist != null) {
           /**
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

    public void getAllMessagesByChatId(int pageNumber,int chatId){
        /** Pagination :- By default last 10 message will go to client **/
        Pageable pageRequest=PageRequest.of(pageNumber,10);
        Page<Messages> messages = messageRepo.findByChatId(pageRequest,chatId);
        List<Messages> reversedMessages = new ArrayList<>(messages.getContent());
        Collections.reverse(reversedMessages);
        Page<Messages> reversedPage = new PageImpl<>(reversedMessages, pageRequest, messages.getTotalElements());
        messagingTemplate.convertAndSend("/topic/all-messages",reversedPage);
    }
}
