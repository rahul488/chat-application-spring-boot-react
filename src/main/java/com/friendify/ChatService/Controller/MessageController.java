package com.friendify.ChatService.Controller;

import com.friendify.ChatService.Dto.Conversion;
import com.friendify.ChatService.Dto.MessageRequestDTO;
import com.friendify.ChatService.Repo.UserRepo;
import com.friendify.ChatService.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepo userRepo;

    //send message
    @MessageMapping("/message/send")
    public void getContent(MessageRequestDTO message){
        messageService.sendMessage(message);
    }

    //get all users
    @MessageMapping("/users/{userId}")
    public void getUser(@DestinationVariable int userId){
        messageService.getAllUsers(userId);
    }

    //start chat
    @MessageMapping("/user/chat")
    public void createChat(@RequestBody Conversion conversion){
        messageService.startNewConversion(conversion);
    }

    @MessageMapping("/user/messages")
    public void getAllMessages(@RequestBody MessageRequestDTO messageRequestDTO){
        messageService.getAllMessagesByChatId(messageRequestDTO.getChatId());
    }


}
